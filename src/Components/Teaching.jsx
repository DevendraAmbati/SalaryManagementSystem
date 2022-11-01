import React,{useState, useEffect} from 'react';
import {db,storage} from './../firebase';
import {collection, query,where, getDocs} from 'firebase/firestore';
import DataTable from 'react-data-table-component';
import './Styles/Common.css';
import BreadCrumbs from './BreadCrumbs';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';;

export default function Teaching() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading,setLoading]= useState(false);

  const fetchEmployees=async()=>{
    const deptRef =query(collection(db,'departments'),where('dept_cat','==','dcat1'));
    const bpsRef =query(collection(db,'basicpayscale'));
    const empRef = query(collection(db,'employees'));
    const empSnap = await getDocs(empRef);
    const deptSnap = await getDocs(deptRef);
    const bpsSnap = await getDocs(bpsRef);
    let deptStore=[],bpsStore=[],empStore=[];
    let temp=[];
    
    deptSnap.forEach((dept)=>{
      deptStore.push({
        deptID:dept.id,
        deptName:dept.data().dept_name
      });
    });
    
    bpsSnap.forEach((bSal)=>{
      bpsStore.push({
        bpsID: bSal.id,
        designation: bSal.data().designation,
        bpsBasic: bSal.data().basic,
        bpsDA: bSal.data().da,
        bpsHRA: bSal.data().hra,
        bpsPF: bSal.data().pf,
        bpsPT: bSal.data().pt,
        bpsTA: bSal.data().ta,
        bpsAGP: bSal.data().grade_pay, 
      });
    });

    empSnap.forEach((emp)=>{
      empStore.push({
          empID: emp.id,
          firstName: emp.data().name.first,
          lastName: emp.data().name.last,
          deptID:emp.data().department,
          pre_yoe: emp.data().pre_yoe,
          qualification: emp.data().qualification,
          doj: emp.data().doj,
          bpsID:emp.data().paygrade,
      });
    });
    deptStore.forEach((dept) => {
      empStore.forEach((emp) => {
        if (emp.deptID === dept.deptID) {
          bpsStore.forEach((bps)=>{
            if(emp.bpsID === bps.bpsID){
              temp.push({...emp,...dept,...bps})
            }
          });  
        }
      });
    });
    setLoading(true);
    setData(temp);
  }

  useEffect(()=>{
    fetchEmployees();
    localStorage.setItem("EmpDatas", JSON.stringify(data));
  },[loading]);

  const navigateEmployee=(empID)=>{
    let temp=[];
    data.forEach((emp)=>{
      if(emp.empID===empID){
        temp=emp;
      }
    });
    localStorage.setItem('RefEmpData', JSON.stringify(temp));
    navigate('/EmployeeDetails');
  }
  const cols=[
    {
      name: 'Employee ID',
      selector: row => row.empID.toUpperCase(),
      sortable: true,
    },
    {
      name: 'Employee Name',
      selector: row => row.firstName+" "+row.lastName,
      sortable: true,
    },
    {
      name: 'Qualification',
      selector: row => row.qualification,
      sortable: true,
    }, 
    {
      name: 'Designation',
      selector: row => row.designation,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.deptName,
      sortable: true,
    },
    {
      name: 'Date Of Joining',
      selector: row => row.doj.toDate().toLocaleDateString('en-IN'),
      sortable: true,
  },
    {
      cell: row => <Button variant="outlined" onClick={()=>navigateEmployee(row.empID)}>View</Button>,
      allowOverflow: true,
      button: true,
    }];
    
    return(
      <div className='Teaching rendering'>
          <BreadCrumbs component='TEACHING'/>
          {loading ?(
            <DataTable columns={cols} data={data} title="Teaching Staffs" pagination responsive fixedHeader fixedHeaderScrollHeight="400px"/>
          ):(
            <h1>Loading</h1>
          )}
      </div>
    );
 
}
