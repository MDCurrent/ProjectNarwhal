package main.java.Controllers;

import main.java.Classes.user;
import main.java.Services.userServices.loginService;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/users")
public class userController {

	loginService loginService = new loginService(); 
	
    @GET
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public boolean getUserCredentials(String[] credentials) {
    	return loginService.loginCheck(credentials[0], credentials[1]);
    }
}