export class CreateProjectDTO {
  companyId: string;
  name;
  description;
  statusId;
}

export class UpdateProjectDTO extends CreateProjectDTO {}
