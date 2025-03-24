import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

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

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
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

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Delete('salary/:id')
  async deleteSalaryProject(@Param('id') id: number) {
    await this.salaryProjectService.deleteSalaryProject(id);
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Post('employee/:projectId')
  async createEmployee(
    @Param('projectId') id: number,
    @Body() dto: CreateEmployeeDTO,
  ) {
    const employee = await this.salaryProjectService.createEmployee(id, dto);
    return employee;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Delete('employee/:projectId')
  async deleteEmployee(
    @Param('projectId') projectId: number,
    @Query('id') employeeId: number,
  ) {
    await this.salaryProjectService.deleteEmployee(projectId, employeeId);
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Get('salary/:enterpriseId')
  async getSalaryProjectByEnterId(@Param('enterpriseId') id: number) {
    const salary = await this.salaryProjectService.findByEnterpriseId(id);
    return salary;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Get('employees/:projectId')
  async getAllEmployees(@Param('projectId') id: number) {
    const employees = await this.salaryProjectService.getAllEmployees(id);
    return employees;
  }

  @Roles(UserRole.OPERATOR)
  @Patch('salary/activate/:id')
  async activateSalaryProject(@Param('id') id: number) {
    await this.salaryProjectService.activateSalaryProject(id);
    return { message: 'Salary project successfuly ativated' };
  }
}
