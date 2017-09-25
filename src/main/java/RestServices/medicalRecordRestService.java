package main.java.RestServices;

import main.java.Classes.medicalRecord;
import main.java.Services.medicalRecordServices.addRecord;
import main.java.Services.medicalRecordServices.lookupRecord;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/users")
public class medicalRecordRestService {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public medicalRecord getJSONrecord() {
        lookupRecord medicalRecordService = new lookupRecord();
        return medicalRecordService.lookup();
    }
}