package main.java.RestServices;

import main.java.Classes.user;
import main.java.Services.userServices.login;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/users")
public class userRestService {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public user getJSONuser(String[] userInfo) {
        login login = new login();
        user user = login.loginCheck(userInfo[0], userInfo[1]);
        return user;
    }
}