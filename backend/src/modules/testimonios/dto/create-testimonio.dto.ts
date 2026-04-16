import { IsString, IsEmail, IsInt, IsOptional, Min, Max, MaxLength } from 'class-validator';

export class CreateTestimonioDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  company?: string;

  @IsString()
  @MaxLength(1000)
  text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}