import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../utils/utils";
import createHttpError from "http-errors";
import Toggle from "./ToggleModel";

export class ToggleController {
  constructor() {
    this.getToggle = this.getToggle.bind(this);
    this.putToggle = this.putToggle.bind(this);
  }

  private async initializeToggle() {
    return Toggle.findOneAndUpdate(
      {},
      { availableAt: null },
      { new: true, upsert: true }
    );
  }


  //NOTE: GET toggle
  async getToggle(req: Request, res: Response, next: NextFunction) {
    try {
      let toggle = await Toggle.findOne({});
      if (!toggle) {
        toggle = await this.initializeToggle();
      }

      if (!toggle || toggle.availableAt === null) {
        res.status(200).json({ underMaintenance: false });
        return;
      }

      const now = new Date();
      if (new Date(toggle.availableAt) < now) {
        await this.initializeToggle();
        res.status(200).json({ underMaintenance: false });
      } else {
        res.status(200).json({ underMaintenance: true, availableAt: toggle.availableAt });
      }
    } catch (error) {
      console.log("Error : ", error);

      next(error);
    }
  }


  //NOTE: Add new toggle
  async putToggle(req: Request, res: Response, next: NextFunction) {
    try {
      const _req = req as AuthRequest;
      const { availableAt } = _req.body;

      if (!availableAt) throw createHttpError(400, "availableAt is required");

      const now = new Date();
      if (availableAt === "null") {
        const toggle = await this.initializeToggle();
        res.status(200).json({ message: "Toggle updated successfully", availableAt: toggle.availableAt });
      } else {
        const time = new Date(availableAt);
        if (time < now) throw createHttpError(400, "availableAt is invalid");

        const toggle = await Toggle.findOneAndUpdate(
          {},
          { availableAt },
          { new: true, upsert: true }
        );
        res.status(200).json({ message: "Toggle updated successfully", availableAt: toggle.availableAt });
      }
    } catch (error) {
      next(error);
    }
  }
}