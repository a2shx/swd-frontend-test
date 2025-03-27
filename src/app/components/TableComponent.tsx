"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import { Checkbox } from "antd";
import { useTranslation } from 'react-i18next';
import { SorterResult, FilterValue } from "antd/es/table/interface";
import styles from "./component.module.css";

interface TableData {
  key: string; // This key should be citizenId
  name: string;
  gender: string;
  mobilePhone: string;
  nationality: string;
}

interface StoredData {
  citizenId: string[];
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  nationality: string;
}

interface TableComponentProps {
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Add setFormSubmitted here
  formSubmitted: boolean;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
}


const TableComponent: React.FC<TableComponentProps> = ({ formSubmitted, setFormSubmitted, setEditingId }) => {

  const [data, setData] = useState<TableData[]>([]); // State to hold table data
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); // Selection state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [pageSize, setPageSize] = useState(10); // Items per page state
  
  const { t } = useTranslation();

  /*
  ========================================================================
                    RETRIEVE DATA FROM LOCAL STORAGE
  ========================================================================
  */
  // Fetch initial data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('submittedForms') || '[]');
    setData(mapToTableData(storedData));
    setFormSubmitted(false);
  }, [formSubmitted]); // listen for changes to localStorage
  /*
  ========================================================================
                        MAP DATA TO TABLE FORMAT
  ========================================================================
  */
  // Map the data to match the table format (StoredData interface)
  const mapToTableData = (renderData: StoredData[]): TableData[] => {
    return renderData.map((item) => ({
      key: item.citizenId.join(""), // Assuming `citizenId` is an array
      name: `${item.firstName} ${item.lastName}`,
      gender: item.gender,
      mobilePhone: item.phoneNumber,
      nationality: item.nationality,
    }));
  };
  /*
  ========================================================================
                          SELECT ALL ITEM HANDLE
  ========================================================================
  */
  const allRowKeys = data.map((item) => item.key);
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(allRowKeys); // Select all
    } else {
      setSelectedRowKeys([]); // Deselect all
    }
  };
  /*
  ========================================================================
                          ROW SELECTION HANDLE
  ========================================================================
  */
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };
  /*
  ========================================================================
                            EDIT BUTTON HANDLE
  ========================================================================
  */
  const handleManage = (key: string) => {
    setEditingId(key)
  };
  /*
  ========================================================================
                          DELETE BULK ITEMS HANDLE
  ========================================================================
  */
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("No records selected!");
      return;
    }
    const storedData: StoredData[] = JSON.parse(localStorage.getItem("submittedForms") || "[]");
    const updatedData = storedData.filter(
      (item) => !selectedRowKeys.includes(item.citizenId.join(""))
    );
    localStorage.setItem("submittedForms", JSON.stringify(updatedData));
    setData(mapToTableData(updatedData));
    setSelectedRowKeys([]); // Clear selection after deletion
    message.success("Selected records deleted successfully!");
  };
  /*
  ========================================================================
                          DELETE EACH ITEM HANDLE
  ========================================================================
  */
  const handleDeleteItem = (key: string) => {
    const storedData: StoredData[] = JSON.parse(localStorage.getItem("submittedForms") || "[]");
    const updatedData = storedData.filter((item) => item.citizenId.join("") !== key);
    localStorage.setItem("submittedForms", JSON.stringify(updatedData));
    setData(mapToTableData(updatedData));
    setFormSubmitted(true);
    message.success("Record deleted successfully!");
  };
  /*
  ========================================================================
                          PAGINATION'S SORTING HANDLE
  ========================================================================
  */
  const handleChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<TableData> | SorterResult<TableData>[], 
  ) => {
    if (!Array.isArray(sorter) && sorter.order && sorter.field) {
      const sortedData = [...data].sort((a, b) => {
        const field = sorter.field as keyof TableData;
        return sorter.order === "ascend"
          ? String(a[field]).localeCompare(String(b[field]))
          : String(b[field]).localeCompare(String(a[field]));
      });
      setData(sortedData);
    }
  };
  
  /*
  ========================================================================
                              COLUMN ALIGNMENT PART
  ========================================================================
  */
  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('Gender'),
      dataIndex: 'gender',
      sorter: true,  // Enable sorting
      render: (text: string) => {
        // Translate gender values (example: Male -> ผู้ชาย, Female -> ผู้หญิง)
        return <span>{t(`gender.${text.toLowerCase()}`)}</span>;
      },
    },
    {
      title: t('Mobile Phone'),
      dataIndex: 'mobilePhone',
      sorter: true,  // Enable sorting
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('Nationality'),
      dataIndex: 'nationality',
      sorter: true,  // Enable sorting
      render: (text: string) => {
        // Translate nationality values (example: Thailand -> ไทย)
        return <span>{t(`nationality.${text.toLowerCase()}`)}</span>;
      },
    },
    {
      title: t('Manage'),
      render: (_: any, record: TableData) => (
        <span>
          <a onClick={() => handleManage(record.key)}>{t("Edit")}</a>
          
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDeleteItem(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <a className={styles.manageStyle}>{t("Delete")}</a>
          </Popconfirm>
      </span>
      ),
      width: '20%',
    },
  ];
  /*
  ========================================================================
                            PAGINATION CONFIG PART
  ========================================================================
  */
  const paginationConfig: TablePaginationConfig = {
    current: currentPage,
    pageSize,
    total: data.length,
    onChange: (page: number) => setCurrentPage(page),
    onShowSizeChange: (current: number, size: number) => setPageSize(size),
    position: ['topRight'], // If you want pagination at the top
    itemRender: (current, type, originalElement) => {
      if (type === 'prev') {
        return <a>{t("PREV")}</a>; // Change 'prev' arrow to 'PREV' text
      }
      if (type === 'next') {
        return <a>{t("NEXT")}</a>; // Change 'next' arrow to 'NEXT' text
      }
      return originalElement; // Default rendering for page numbers
    }
  };
  /*
  ========================================================================
                                  JSX PART
  ========================================================================
  */
  return (
    <div className={styles.tableStyle}>
      <div>
{/* 
  ========================================================================
                    SELECT ALL & DELETE SELECTED PART
  ========================================================================
 */}
      <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={selectedRowKeys.length === allRowKeys.length && allRowKeys.length > 0}
        />
        <span className={styles.selectAllLabel}>
        {t("Select All")}
        </span>
      <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleBulkDelete()}
            okText="Yes"
            cancelText="No"
          >
      <Button
        disabled={selectedRowKeys.length === 0}
        className={styles.deleteButton}
      >
        {t("Delete")}
      </Button>
      </Popconfirm>
      </div>
{/* 
  ========================================================================
                              TABLE PART
  ========================================================================
 */}
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
