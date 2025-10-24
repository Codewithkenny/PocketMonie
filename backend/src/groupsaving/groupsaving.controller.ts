import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groupsaving.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-groupsaving.dto';
import { ContributeDto } from '../contribution/dto/contribute.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() dto: CreateGroupDto, @Req() req) {
    return this.groupsService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post(':id/contribute')
  contribute(@Param('id') id: string, @Body() dto: ContributeDto, @Req() req) {
    return this.groupsService.contribute(id, dto, req.user);
  }
}
