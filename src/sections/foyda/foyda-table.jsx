import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

export const FoydaTable = (props) => {
  const {
    count = 0,
    items,
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []   
  } = props;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  const [tushum, setTushum] = useState([]);

  useEffect(() => {
    const overallTushum = items.appointmentsApi.reduce((acc, obj) => {
      return acc + obj.cash + obj.card + obj.click
    }, 0);

    const dateRange = formatDate(items.startDate) + " - " + formatDate(items.endDate)



    const overallChiqim = items.chiqim.reduce((acc, obj) => {
      return acc + obj.amount
    }, 0);

        setTushum([{
          dateRange,
          overallTushum,
          overallChiqim,
          overallFoyda: overallTushum - overallChiqim  
        }])

  }, [items])



  const selectedSome = (selected.length > 0) && (selected.length < items.appointmentsApi.length);
  const selectedAll = (items.appointmentsApi.length > 0) && (selected.length === items.appointmentsApi.length);

  

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Sana
                </TableCell>
                <TableCell>
                  Tushum
                </TableCell>
                <TableCell>
                  Chiqim
                </TableCell>
                <TableCell>
                  Foyda
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tushum.map((item, index) => {
                const isSelected = selected.includes(index);
                // console.log(appointment);
                // const createdAt = format(appointment.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(index);
                          } else {
                            onDeselectOne?.(index);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                        {item.dateRange}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {item.overallTushum}            
                     
                    </TableCell>
                    <TableCell>
                      {item.overallChiqim}
         
                    </TableCell>
                    <TableCell>
                      {item.overallFoyda}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

FoydaTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.object,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
