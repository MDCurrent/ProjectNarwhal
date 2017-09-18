package util;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import models.medicalRecord;
import java.util.Scanner;
import BL.addRecord;

public class HibernateUtil {

	public static void main(String[] args) {
		
		addRecord addRec = new addRecord();
		medicalRecord newRecord = new medicalRecord();
		
		Configuration cf = new Configuration().configure("hibernate.cfg.xml");
		
		cf.addClass(medicalRecord.class);
		
		StandardServiceRegistryBuilder srb = new StandardServiceRegistryBuilder();
		srb.applySettings(cf.getProperties());
		ServiceRegistry sr = srb.build();
		SessionFactory sf = cf.buildSessionFactory(sr);
		
		Session session = sf.openSession();
		
		Scanner scanner = new Scanner(System.in);
		
		System.out.println("Would you like to \'lookup\' or \'add\' a Record?");
		String answer = scanner.next();
		
		if(answer.equals("lookup")){
			System.out.println("Here are all the records you have access to: ");
        }
		else if(answer.equals("add")){
			newRecord = addRec.addMedicalRecord();
        }
		else{
			System.out.println("Please enter either \'lookup\' or \'add\'");
        }
        	
       	Transaction tx = session.beginTransaction();
		session.save(newRecord);
       	tx.commit();
       	System.out.println("Object saved successfully.....!!");
        scanner.close();
        session.close();
        sf.close();
	}
}