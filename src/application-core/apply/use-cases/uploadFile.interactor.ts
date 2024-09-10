import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadFileInteractor {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async execute(
    path: string,
    file: { data: string; mime: string; ext: string },
  ): Promise<string> {
    const bucketName: string = 'cdn.spushing.com';
    const cdnUrl: string = 'https://cdn.spushing.com';
    const buffer: Buffer = Buffer.from(file.data.split(',')[1], 'base64');
    const bucketParams = {
      Bucket: bucketName,
      Key: `${path}/${uuidv4()}.${file.ext}`,
      Body: buffer,
      ContentType: file.mime,
    };
    try {
      const command: PutObjectCommand = new PutObjectCommand(bucketParams);
      await this.s3.send(command);
      return `${cdnUrl}/${bucketParams.Key}`;
    } catch (e) {
      console.log('Error: ', e);
      throw new BadRequestException(e.message);
    }
  }
}
