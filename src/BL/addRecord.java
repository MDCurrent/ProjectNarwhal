package BL;

import models.medicalRecord;
import java.util.Scanner;

public class addRecord {
	
	Scanner scanner = new Scanner(System.in);
	
	public medicalRecord addMedicalRecord(){
		medicalRecord newRecord = new medicalRecord();
		System.out.println("Please complete the following fields: ");
		inputPatientId(newRecord);
		inputDoctorId(newRecord);
		inputTreatment(newRecord);
		inputDescription(newRecord);
		inputRecordDate(newRecord);
		return newRecord;
	}

	private void inputPatientId(medicalRecord newRecord){
		boolean validIdGiven = false;
		while(!validIdGiven){
			System.out.print("Patients Id: ");
			scanner.reset();
			//TODO We can cross reference this Id with the Patient table to make sure they are a valid patient later
			try{
	    		newRecord.setPatientId(scanner.nextInt());
	    		validIdGiven = true;
			} catch(Exception e){
				System.out.println("That is not a valid Patient Id number");
				scanner.next();
			}
		}
	}
	
	private void inputDoctorId(medicalRecord newRecord){
		boolean validIdGiven = false;
		while(!validIdGiven){
			System.out.print("Doctor Id: ");
			scanner.reset();
			//TODO We can cross reference this Id with the Doctor table to make sure they are a valid doctor later
			try{
	    		newRecord.setDoctorId(scanner.nextInt());
	    		validIdGiven = true;
			} catch(Exception e){
				System.out.println("That is not a valid Doctor Id number");
				scanner.next();
			}
		}
	}
	
	private void inputTreatment(medicalRecord newRecord){
		boolean validTreatmentGiven = false;
		while(!validTreatmentGiven){
			System.out.print("Treatment: ");
			scanner.reset();
			//TODO We can cross reference this Id with the Doctor table to make sure they are a valid doctor later
			try{
	    		newRecord.setTreatment(scanner.next());
	    		validTreatmentGiven = true;
			} catch(Exception e){
				System.out.println("That is not a valid Treatment");
				scanner.next();
			}
		}
	}
	
	private void inputDescription(medicalRecord newRecord){
		boolean validDescriptionGiven = false;
		while(!validDescriptionGiven){
			System.out.print("Description: ");
			scanner.reset();
			//TODO We can cross reference this Id with the Doctor table to make sure they are a valid doctor later
			try{
	    		newRecord.setDescription(scanner.next());
	    		validDescriptionGiven = true;
			} catch(Exception e){
				System.out.println("That is not a valid Description");
				scanner.next();
			}
		}
	}
	
	private void inputRecordDate(medicalRecord newRecord){
		newRecord.setRecordDate();
		System.out.println("This records input date is: " + newRecord.getRecordDate());
	}
}
