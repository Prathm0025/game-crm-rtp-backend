import { PlatformSessionModel } from "./sessionModel";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

class SessionController{

  async  playerSessionHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate, playerId, page = 1, limit = 10 } = req.query;

        if (!startDate) {
            throw createHttpError(400, "startDate query parameter is required");
        }

        if (!endDate) {
            throw createHttpError(400, "endDate query parameter is required");
        }

        if (!playerId) {
            throw createHttpError(400, "Player ID query parameter is required");
        }

        const parsedStartDate = new Date(startDate as string);
        if (isNaN(parsedStartDate.getTime())) {
            throw createHttpError(400, "Invalid startDate format");
        }

        const parsedEndDate = new Date(endDate as string);
        if (isNaN(parsedEndDate.getTime())) {
            throw createHttpError(400, "Invalid endDate format");
        }

        if (parsedStartDate > parsedEndDate) {
            throw createHttpError(400, "startDate cannot be after endDate");
        }

        const query = {
            playerId: playerId,
            entryTime: { $gte: parsedStartDate },
            exitTime: { $lte: parsedEndDate }
        };

        const totalSessions = await PlatformSessionModel.countDocuments(query);

        if (totalSessions === 0) {
            throw createHttpError(404, "No session data found for this player within the given date range");
        }

        const totalPages = Math.ceil(totalSessions / Number(limit));
        if (Number(page) > totalPages) {
            throw createHttpError(404, "Number of page exceeds total pages");
        }

        const platformSessionsForExcel =  await PlatformSessionModel.find(query);
        const platformSessions = await PlatformSessionModel.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        return res.status(200).json({
            sessionData: platformSessions,
            excelData:platformSessionsForExcel,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: totalPages,
                totalSessions: totalSessions
            }
        });
    } catch (error) {
        console.error("Error retrieving player session data:", error);
        next(error);
    }
}

}

export default new SessionController();