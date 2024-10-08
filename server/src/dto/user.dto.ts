import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserRegisterDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, {message: 'password too short'})
    password: string;

    @IsString()
    @IsOptional()
    name: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(4, {message: 'password too short'})
  password: string;

  @IsString()
  @IsOptional()
  name: string;
}
