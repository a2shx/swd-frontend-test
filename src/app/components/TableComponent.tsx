"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
// import useRenderData from './useRenderData';

interface TableData {
  key: string; // This key should be citizenId
  name: string;
  gender: string;
  mobilePhone: string;
  nationality: string;
}

interface TableComponentProps {
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Add setFormSubmitted here
  formSubmitted: boolean;
}


const TableComponent: React.FC<TableComponentProps> = ({ formSubmitted, setFormSubmitted }) => {

  const [data, setData] = useState<TableData[]>([]); // State to hold table data

  // Fetch initial data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('submittedForms') || '[]');
    setData(mapToTableData(storedData));
    setFormSubmitted(false);
  }, [formSubmitted]); // listen for changes to localStorage

  // Map the data to match the table format
  const mapToTableData = (renderData: any[]) => {
    return renderData.map((item) => ({
      key: item.citizenId.join(""), // Assuming `citizenId` is an array
      name: `${item.firstName} ${item.lastName}`,
      gender: item.gender,
      mobilePhone: item.phoneNumber,
      nationality: item.nationality,
    }));
  };


  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); // Selection state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [pageSize, setPageSize] = useState(10); // Items per page state

  // Handle row selection change
  const handleSelectChange = (newSelectedRowKeys: Key[], selectedRows: TableData[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log("Selected Row Keys:", newSelectedRowKeys);
    console.log("Selected Rows:", selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange, // Handle selection changes
  };

  const handleManage = (key: string) => {
    message.info(`Manage action for row ${key}`);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to delete.');
      return;
    }

    const remainingData = data.filter((item) => !selectedRowKeys.includes(item.key));
    setData(remainingData);
    setSelectedRowKeys([]); // Clear selected rows after delete
    message.success('Selected rows have been deleted.');
  };

  const handleDeleteItem = (key: string) => {
    const remainingData = data.filter((item) => item.key !== key);
    setData(remainingData);
    message.success(`Row ${key} has been deleted.`);
  };

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.order) {
      const sortedData = [...data].sort((a, b) => {
        if (sorter.order === 'ascend') {
          return a[sorter.field as keyof TableData] > b[sorter.field as keyof TableData] ? 1 : -1;
        } else {
          return a[sorter.field as keyof TableData] < b[sorter.field as keyof TableData] ? 1 : -1;
        }
      });
      setData(sortedData);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Mobile Phone',
      dataIndex: 'mobilePhone',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Manage',
      render: (_: any, record: TableData) => (
        <span>
          <Button onClick={() => handleManage(record.key)} type="primary" style={{ marginRight: 10 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDeleteItem(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </span>
      ),
      width: '20%',
    },
  ];

  const paginationConfig: TablePaginationConfig = {
    current: currentPage,
    pageSize,
    total: data.length,
    onChange: (page: number) => setCurrentPage(page),
    showSizeChanger: true,
    onShowSizeChange: (current: number, size: number) => setPageSize(size),
  };

  return (
    <div>
      <Button
        onClick={handleBulkDelete}
        disabled={selectedRowKeys.length === 0}
        style={{ marginBottom: '20px' }}
      >
        Delete Selected Items
      </Button>

      <Table
        rowKey="key" // Unique key for rows
        columns={columns}
        dataSource={data}
        pagination={paginationConfig}
        onChange={handleChange} // Handle sorting and pagination changes
        rowSelection={rowSelection}
        sortDirections={['ascend', 'descend']} // Available sort directions
      />
    </div>
  );
};

export default TableComponent;
