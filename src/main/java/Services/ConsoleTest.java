package main.java.Services;

import java.util.Date;
import java.util.Scanner;

import org.hibernate.Session;

import main.java.Services.addRecord;
import main.java.Classes.HibernateUtil;
import main.java.Classes.medicalRecord;
 
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
			System.out.println("Here are all the records you have access to: ");
        }
		else if(answer.equals("add")){
			newRecord = addRec.addMedicalRecord();
        }
		else{
			System.out.println("Please enter either \'lookup\' or \'add\'");
        }
        
        session.save(newRecord);
        session.getTransaction().commit();
 
    }
 
}