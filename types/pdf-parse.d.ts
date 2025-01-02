declare module 'pdf-parse' {
  export default function pdfParse(
    buffer: Buffer | Uint8Array
  ): Promise<{
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }>;
}
