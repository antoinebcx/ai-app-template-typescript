declare namespace Express {
    export interface Request {
      file?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
      };
    }
}
