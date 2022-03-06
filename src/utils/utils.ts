import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_WRONG_MESSAGE =
  'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un caracter especial.';

const UNPROCESSABLE_ENTITY_VALIDATION = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_REGEX,
};

export const MESSAGES = {
  PASSWORD_WRONG_MESSAGE,
};

export const VALIDATIONS = {
  UNPROCESSABLE_ENTITY_VALIDATION,
};
