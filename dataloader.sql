/* 
file intended to hold all basic additions to the db, never delete anything in this file, just write code to edit it
I will see about writing something to automate changes in an alter batch file list (not a priority obviously haha)
*/

create table MedicalRecords (
	recordId int not null identity(1,1) primary key,
    patientId int not null,
    doctorId int,
    treatment text not null,
    description text not null,
    recordDate date
);

create table Users (
	userId int not null identity(1,1) primary key,
	userName varchar(100) not null unique,
	password char(40) not null,
	firstName text not null,
	lastName text not null,
);