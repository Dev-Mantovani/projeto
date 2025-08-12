import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const Header = styled.div`
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 22px;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 20px;
  background: #f6fff6;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 12px;
    margin-bottom: 4px;
    color: #333;
  }
  select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${({ active }) => (active ? "#e6f9e6" : "#f5f5f5")};
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #e6f9e6;
  }
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    background: #f6fff6;
    padding: 8px;
    text-align: left;
    font-size: 13px;
  }

  td {
    padding: 8px;
    font-size: 13px;
    border-bottom: 1px solid #eee;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  background: ${({ status }) =>
    status === "Enviado"
      ? "black"
      : status === "Pendente"
      ? "#ccc"
      : "#eee"};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
`;

export const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  max-width: 400px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  label {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

export const Input = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;
