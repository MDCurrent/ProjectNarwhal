package main.java.Services.userServices;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;

import main.java.Classes.HibernateUtil;
import main.java.Classes.user;

public class login {
Session session = HibernateUtil.getSessionFactory().openSession();
	
	public user loginCheck(String userName, String password){
		Query query = session.createQuery("from user where userName = :uName and passowrd = :pWord ");
		query.setParameter("uName", userName);
		query.setParameter("pWord", password);
		List<user> list = query.list();
		if(list.size() == 1){
			return list.get(0);
		}
		return null;
	}
}
