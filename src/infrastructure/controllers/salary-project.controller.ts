import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { SalaryProjectService } from 'src/application/services/salary-project.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { CreateEmployeeDTO } from 'src/application/dto/create-employee.dto';
import { CreateSalaryProjectDTO } from 'src/application/dto/create-salary-project.dto';

@Controller('salary-projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SalaryProjectController {
  private readonly salaryProjectService: SalaryProjectService;

  constructor(
    @Inject(ServiceProxyModule.SALARY_PROJECT_SERVICE_PROXY)
    private readonly salaryProjectServiceProxy: ServiceProxy<SalaryProjectService>,
  ) {
    this.salaryProjectService = salaryProjectServiceProxy.getInstance();
  }

  @Post('salary/:enterId')
  async createSalaryProject(
    @Body() dto: CreateSalaryProjectDTO,
    @Param('enterId') enterId: number,
  ) {
    const salaryProject = await this.salaryProjectService.createSalaryProject(
      enterId,
      dto,
    );
    return salaryProject;
  }

  @Delete('salary/:id')
  async deleteSalaryProject(@Param('id') id: number) {
    await this.salaryProjectService.deleteSalaryProject(id);
  }

  @Post('employee/:projectId')
  async createEmployee(
    @Param('projectId') id: number,
    @Body() dto: CreateEmployeeDTO,
  ) {
    const employee = await this.salaryProjectService.createEmployee(id, dto);
    return employee;
  }

  @Delete('employee/:projectId')
  async deleteEmployee(
    @Param('projectId') projectId: number,
    @Query('id') employeeId: number,
  ) {
    await this.salaryProjectService.deleteEmployee(projectId, employeeId);
  }

  @Get('salary/:enterpriseId')
  async getSalaryProjectByEnterId(@Param('enterpriseId') id: number) {
    const salary = await this.salaryProjectService.findByEnterpriseId(id);
    return salary;
  }

  @Get('employees/:projectId')
  async getAllEmployees(@Param('projectId') id: number) {
    const employees = await this.salaryProjectService.getAllEmployees(id);
    return employees;
  }
}
