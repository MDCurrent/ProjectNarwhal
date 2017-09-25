package main.java.Services;

import java.util.Date;
import java.util.List;
import java.util.Scanner;

import org.hibernate.Query;
import org.hibernate.Session;

import main.java.Classes.HibernateUtil;
import main.java.Classes.medicalRecord;
import main.java.Services.medicalRecordServices.addRecord;
 
public class ConsoleTest {
    public static void main(String[] args) {
        Session session = HibernateUtil.getSessionFactory().openSession();
 
        session.beginTransaction();
 
        Scanner scanner = new Scanner(System.in);
		
		addRecord addRec = new addRecord();
		medicalRecord newRecord = new medicalRecord();
				
		System.out.println("Would you like to \'lookup\' or \'add\' a Record?");
		String answer = scanner.next();
		
		if(answer.equals("lookup")){
			Query query = session.createQuery("from medicalRecord where patientId = '1' ");
			List list = query.list();
			System.out.println(list.get(0));
        }
		else if(answer.equals("add")){
			newRecord = addRec.addMedicalRecord();
	        session.save(newRecord);
	        session.getTransaction().commit();
        }
		else{
			System.out.println("Please enter either \'lookup\' or \'add\'");
        }
        
    }
 
}