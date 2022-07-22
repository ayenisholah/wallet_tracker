import { IsString, IsNumber, IsArray, IsOptional, IsNumberString } from 'class-validator';

export class PaginateResponseDto {
  @IsNumber()
  public limit: number;

  @IsNumber()
  public count?: number;

  @IsNumber()
  public offset: number;

  @IsString()
  @IsOptional()
  public order?: string;

  @IsArray()
  public data: any[];
}

export class QuerySearchParamsDto {
  @IsOptional()
  @IsNumberString()
  public limit?: number;
  @IsOptional()
  @IsNumberString()
  public offset?: number;
  @IsOptional()
  @IsString()
  public order?: string;
}
