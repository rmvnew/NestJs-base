import { Controller, Get, Post, Body, Param, UseGuards, Put, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';
import { FilterUser } from './dto/Filter.user';
import { Pagination } from 'nestjs-typeorm-paginate';
import { getUserPath } from 'src/common/routes.path';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { ProfileEntity } from 'src/profile/entities/profile.entity';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  @PublicRoute()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  @Get('/profile')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.userService.findAllProfile()
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAll(
    @Query() filter: FilterUser
  ): Promise<Pagination<UserEntity>> {

    filter.route = getUserPath()

    return this.userService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findOne(
    @Param('id') id: number
  ): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/status/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async changeStatus(
    @Param('id') id: number
  ): Promise<UserEntity> {
    return this.userService.changeStatus(id);
  }

  @Patch('/change-password/:id/:currentPass/:firstPass/:secondPass')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async changePassword(
    @Param('id') id: number,
    @Param('currentPass') currentPass: string,
    @Param('firstPass') firstPass: string,
    @Param('secondPass') secondPass: string
  ) {
    return this.userService.changePassword(id, currentPass, firstPass, secondPass)
  }

  @Patch('/resetPass/:email')
  @PublicRoute()
  async resetPassword(
    @Param('email') email: string
  ) {
    return this.userService.resetPassword(email)
  }

}
