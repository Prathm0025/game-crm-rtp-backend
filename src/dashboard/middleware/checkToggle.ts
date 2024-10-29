
import { Request, Response, NextFunction } from 'express';
import Toggle from '../Toggle/ToggleModel';
import { AuthRequest } from '../../utils/utils';

export const checkToggle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as AuthRequest;
    const { role } = _req.user;

    // Apply this check only if the user's role is "player"
    if (role !== "player") {
      return next(); // Skip toggle check for non-player roles
    }

    const toggle = await Toggle.findOne();

    if (toggle?.availableAt) {
      const now = new Date();
      const availableAt = new Date(toggle.availableAt);

      // Check if the current time is before the 'availableAt' time
      if (now < availableAt) {
        return res.status(503).json({ message: `Under Maintenance until ${availableAt}` });
      }

      // If the time has passed, reset 'availableAt' to null
      toggle.availableAt = null;
      await toggle.save();
    }

    next(); // Proceed if the service is available
  } catch (error) {
    return res.status(500).json({ message: 'Error checking service status' });
  }
};


export const checkToggleForPlayer = async () => {
  const toggle = await Toggle.findOne();

  if (toggle?.availableAt) {
    const now = new Date();
    const availableAt = new Date(toggle.availableAt);

    // Check if the current time is before the 'availableAt' time
    if (now < availableAt) {
      return { isUnderMaintenance: true, availableAt };
    }

    // If the time has passed, reset 'availableAt' to null
    toggle.availableAt = null;
    await toggle.save();
  }

  return { isUnderMaintenance: false };
};