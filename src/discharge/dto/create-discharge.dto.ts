import { IsArray, IsNotEmpty, IsString, Validate, ValidationArguments, ValidatorConstraintInterface } from "class-validator";


class FileListValidator implements ValidatorConstraintInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(files: File[], args: ValidationArguments) {
        if (!Array.isArray(files)) return false;

        files.map(file => {
            console.log(file.type)
        })

        const MAX_SIZE = 210 * 1024 * 1024; // 10 MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

        // Validate each file
        return files.every(
            (file) =>
                file.size <= MAX_SIZE && ALLOWED_TYPES.includes(file.type)
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return 'Each file must be less than 10MB and of type JPEG, JPG, or PNG.';
    }
}

export class CreateDischargeDto {
    @IsNotEmpty()
    @IsString()
    admissionId: string


}

export class FilesValidator {
    @IsArray({ message: 'Files must be an array.' })
    @IsNotEmpty({ each: true, message: 'Each file must not be empty.' })
    @Validate(FileListValidator, { message: 'Invalid files provided.' })
    files: Express.Multer.File[]
}

