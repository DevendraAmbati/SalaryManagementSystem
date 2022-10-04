import React,{useState, useEffect, Component} from 'react'
import db from './../firebase';
import {collection, query, onSnapshot,where} from 'firebase/firestore';
import ReactDOM  from 'react-dom';
import DataTable,{CustomLoader} from 'react-data-table-component';
import './Common.css'

export default function Non_Teaching() {
  function filterDeptById(jsonObject, id) {
      for (const obj of jsonObject) {
        if(obj.id === id) {
          return obj.dept_name;
      }  
    }
  }
  function filterBasicPayById(jsonObject, id) {
    for (const obj of jsonObject) {
      if(obj.id === id) {
        return obj.basic;
    }  
  }
}
function filterDesigById(jsonObject, id) {
  for (const obj of jsonObject) {
    if(obj.id === id) {
      return obj.Designation;
  }  
}
}

  const deptRef =query(collection(db,'nonteaching_department'));
  const bSRef =query(collection(db,'basicpayscale'));
  //const empRef = query(collection(db,'employees'));
  const [Dept,setDeptData]=useState([]);
  const [Salary,setSalaryData]=useState([]);
  const [eData, setEData] = useState([]);
  const [loader, setloader] = useState(false);
  
  useEffect(()=>{
    onSnapshot(bSRef,(bSSnap)=>{
      const bSStore=[];
      bSSnap.forEach((bSal)=>{
        bSStore.push({
          id: bSal.id,
          Designation: bSal.data().Designation, 
          basic: bSal.data().basic
        });
        setSalaryData(bSStore);
      });
    });
  });
  
  useEffect(()=>{
    onSnapshot(deptRef,(deptSnap)=>{
      const deptStore=[];
      deptSnap.forEach((dept)=>{
        deptStore.push({
          id:dept.id,
          dept_name:dept.data().dept_name
        });
        setDeptData(deptStore);
      });
    });   
  });

  useEffect(()=>{
    const items = []
    Dept.map((item)=>{
      const empRef = query(collection(db,'employees'),where('department','==',item.id));
      onSnapshot(empRef,(querySnapshot) => {
      ;
      querySnapshot.forEach((doc) => {
        var department= filterDeptById(Dept,doc.data().department);
        items.push({
          id: doc.id,
          name: doc.data().name,
          department: department,
          YOEP: doc.data().YOEP,
          Qualification: doc.data().Qualification,
          DOJ: doc.data().DOJ,
          designation:doc.data().Designation
        });
      });
    setEData(items);
    setloader(true);
    });
    });
  });

  const cols=[
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Qualification',
      selector: row => row.Qualification,
      sortable: true,
    },
    {
        name: 'Date Of Joining',
        selector: row => row.DOJ.toDate().toDateString(),
        sortable: true,
    },
    {
      name: 'Years Of Experience',
      selector: row => row.YOEP,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: row => row.designation,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.department,
      sortable: true,
    }];

  return (
    <div className='Non_Teaching rendering'>
    <DataTable columns={cols} data={eData} title="Non-Teaching Staffs"pagination responsive fixedHeader fixedHeaderScrollHeight="500px" />
 </div>
  
  );
}
