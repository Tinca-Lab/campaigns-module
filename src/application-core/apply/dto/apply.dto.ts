import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IDocument {
  @ApiProperty()
  mime: string;

  @ApiProperty()
  ext: string;

  @ApiPropertyOptional()
  @IsOptional()
  data: string;
}

export class IEvidence {
  @ApiProperty()
  @IsNotEmpty()
  document: IDocument;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  givenAt: Date;
}

export class IClient {
  @ApiProperty()
  sex: string;

  @ApiProperty()
  age: string;

  @ApiProperty()
  tourist: boolean;
}

export class ILocation {
  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;
}

export class CreateApplyDTO {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiPropertyOptional()
  @IsOptional()
  evidences?: IEvidence; // Ahora es un solo objeto en lugar de un array

  @ApiProperty()
  @IsNotEmpty()
  client: IClient[];

  @ApiProperty()
  @IsNotEmpty()
  location: ILocation;
}

export class AttachEvidenceDTO {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty()
  @IsNotEmpty()
  evidence: IEvidence;
}
