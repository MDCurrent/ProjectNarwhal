package main.java.Services.medicalRecordServices;

import main.java.Classes.HibernateUtil;
import main.java.Classes.medicalRecord;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import org.hibernate.Query;
import org.hibernate.Session;

public class lookupRecord {
	
	Session session = HibernateUtil.getSessionFactory().openSession();
	
	public medicalRecord lookup(){
		Query query = session.createQuery("from medicalRecord where patientId = '1' ");
		return ((List<medicalRecord>) query.list()).get(0);
	}
	
}
