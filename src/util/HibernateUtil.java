package util;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import models.medicalRecord;

public class HibernateUtil {

        public static void main(String[] args) {

                Configuration cf = new Configuration().configure("hibernate.cfg.xml");

                StandardServiceRegistryBuilder srb = new StandardServiceRegistryBuilder();
                srb.applySettings(cf.getProperties());
                ServiceRegistry sr = srb.build();
                SessionFactory sf = cf.buildSessionFactory(sr);

                Session session = sf.openSession();
                medicalRecord medRec = new medicalRecord();
                medRec.recordId = 1;
                medRec.patientId = 2;
                medRec.doctorId = 3;
                medRec.treatment = "nothing";
                medRec.description = "something";
                medRec.recordDate = null;

                Transaction tx = session.beginTransaction();
                session.save(medRec);
                tx.commit();
                System.out.println("Object saved successfully.....!!");
                session.close();
                sf.close();
        }
}