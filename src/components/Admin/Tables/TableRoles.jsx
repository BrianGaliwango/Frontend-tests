import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Form, Row } from "react-bootstrap";
import { Button, makeStyles, TableBody, TableContainer, TableHead, TableRow, TablePagination, Checkbox } from "@material-ui/core";
import { Table } from "components/Table";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { BorderlessTableCell } from "components/Table";
import { StripedTableRow } from "components/Table";

function createData(name, permissions) {
	return { name, permissions };
}

// data
const data = [
	createData("User1", "active"),
	createData("User2", "inactive"),
	createData("User3", "active"),
	createData("User4", "active"),
	createData("User5", "trash"),
	createData("User6", "active"),
	createData("User7", "active"),
	createData("User8", "trash"),
	createData("User9", "active"),
	createData("User10", "trash"),
	createData("User11", "inactive"),
	createData("User12", "active"),
	createData("User13", "inactive"),
];

// header cells
const headCells = [
	{ id: "name", label: "Name" },
	{ id: "permissions", label: "Permissions" },
];

// table header with checkbox
function EnhancedTableHead(props) {
	const { onSelectAllClick, numSelected, rowCount } = props;

	return (
		<TableHead>
			<TableRow className="bg-primary-light">
				<BorderlessTableCell>
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all roles" }}
						className="p-0"
					/>
				</BorderlessTableCell>
				{headCells.map((headCell) => (
					<BorderlessTableCell key={headCell.id} className="fw-bold text-secondary">
						{headCell.label}
					</BorderlessTableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number.isRequired,
};

// table actions
const EnhancedTableToolbar = (props) => {
	const { numSelected } = props;

	return (
		<Row className={`align-items-center gx-3 ${numSelected > 0 ? "mb-3 justify-content-between" : "justify-content-end"}`}>
			{numSelected > 0 && (
				<>
					<Col sm={5} md={7} xl={7} xxl={9}>
						<h5 className="mb-3 mb-sm-0 text-primary">{numSelected} selected</h5>
					</Col>
					<Col xs={9} sm={4} md={3} xl={3} xxl={2}>
						<Form.Select aria-label="Selection Action" className="p-input px-3">
							<option>Action For Selected</option>
							<option value="deletePermanent">Delete Permanently</option>
						</Form.Select>
					</Col>
					<Col xs={3} md={2} xl={2} xxl={1}>
						<Button variant="contained" color="primary" className="p-input w-100 rounded-4" disableElevation>
							Apply
						</Button>
					</Col>
				</>
			)}
		</Row>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

// styling
const useStyles = makeStyles({
	toolbar: {
		minHeight: "auto",
		padding: 0,
	},
	actions: {
		marginLeft: "1em",
	},
});

// main table
export default function TableRoles(props) {
	const classes = useStyles();
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = data.map((n) => n.name);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	return (
		<>
			{/* show main table */}
			<div className="card">
				<div className="card-body d-grid">
					{/* show toolbar */}
					<EnhancedTableToolbar numSelected={selected.length} />
					<TableContainer>
						<Table aria-labelledby="Table Roles" aria-label="enhanced table">
							{/* show table header */}
							<EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={data.length} />
							{/* show table body */}
							<TableBody>
								{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
									const labelId = `users-list-${index}`;
									const { name, permissions } = row;
									const isItemSelected = isSelected(name);

									return (
										<StripedTableRow key={index} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected} className={index % 2 === 1 ? "bg-gray-table" : undefined}>
											<BorderlessTableCell onClick={(event) => handleClick(event, name)}>
												<Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} className="p-0" />
											</BorderlessTableCell>
											<BorderlessTableCell>{name}</BorderlessTableCell>
											<BorderlessTableCell>{permissions}</BorderlessTableCell>
										</StripedTableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
					{/* show table pagination */}
					{data.length > 5 && (
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={data.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							labelRowsPerPage="Rows"
							backIconButtonProps={{ className: "bg-primary-light p-2 me-2" }}
							nextIconButtonProps={{ className: "bg-primary-light p-2" }}
							SelectProps={{ className: "bg-gray-200 rounded-4 ms-2 me-5", IconComponent: KeyboardArrowDownIcon }}
							className="mt-3"
							classes={{ toolbar: classes.toolbar, actions: classes.actions }}
						/>
					)}
				</div>
			</div>
		</>
	);
}
