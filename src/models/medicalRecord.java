package main.java;
import java.util.Date;

public class medicalRecord 
{
	private int recordId;
	private int patientId;
	private int doctorId;
	private String treatment;
	private String description;
	private Date recordDate;
	
	public medicalRecord(int recordId, int patientId, int doctorId, String treatment, String description, Date recordDate)
	{
		super();
		this.recordId = recordId;
		this.patientId = patientId;
		this.doctorId = doctorId;
		this.treatment = treatment;
		this.description = description;
		this.recordDate = recordDate;
	}
	
	public medicalRecord(){
		super();
	}
	
	public int getRecordId(){
		return recordId;
	}
	
	private void setRecordId(int recordId){
		this.recordId = recordId;
	}
	
	public int getPatentId(){
		return patientId;
	}
	
	public void setPatentId(int patientId){
		this.patientId = patientId;
	}
	
	public int getDoctorId(){
		return doctorId;
	}
	
	public void setDoctorId(int doctorId){
		this.doctorId = doctorId;
	}
	
	public String getTreatment(){
		return treatment;
	}
	
	public void setTreatment(String treatment){
		this.treatment = treatment;
	}
	
	public String getDescription(){
		return description;
	}
	
	public void setDesciption(String description){
		this.description = description;
	}
	
	public Date getRecordDate(){
		return recordDate;
	}
	
	public void set(Date recordDate){
		this.recordDate = recordDate;
	}
}
