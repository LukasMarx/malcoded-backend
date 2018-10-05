export class CreateEmailTemplateDto {
  name: string;
  mjml: String;
  previewBase64: String;
  variables: [String];
}

export class UpdateEmailTemplateDto {
  name: string;
  mjml: String;
  previewBase64: String;
  variables: [String];
}
