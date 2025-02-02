using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HospitalAPI.Dtos.Admin;
using HospitalAPI.Dtos.HealthSupervisor;
using HospitalAPI.Dtos.Patient;
using HospitalAPI.Models;

namespace HospitalAPI.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Patient, PatientDto>().ReverseMap();
            CreateMap<HealthCarePro, HealthCareProDTO>().ReverseMap();
        }


    }
}