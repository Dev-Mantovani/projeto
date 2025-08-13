import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d7d32 0%, #a8aca9 50%, #4caf50 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  div {
    h1 {
      margin: 0;
      font-size: 28px;
      color: white;
      font-weight: 700;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    p {
      margin: 5px 0 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;

    div h1 {
      font-size: 24px;
    }
  }
`;

export const SearchBar = styled.div`
  input {
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    width: 300px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 4px 20px rgba(45, 125, 50, 0.3);
      transform: translateY(-2px);
      border: 2px solid #4caf50;
    }

    &::placeholder {
      color: #666;
    }
  }

  @media (max-width: 768px) {
    input {
      width: 100%;
      max-width: 300px;
    }
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
`;

export const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(45, 125, 50, 0.2);
    border-color: #4caf50;
  }

  .metric-icon {
    font-size: 32px;
    padding: 15px;
    background: linear-gradient(135deg, #97ac99, #4caf50);
    border-radius: 15px;
    color: white;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #1b5e20;
  }

  p {
    margin: 5px 0 0 0;
    color: #388e3c;
    font-size: 14px;
    font-weight: 500;

  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 15px;

    .metric-icon {
      font-size: 28px;
      padding: 12px;
    }

    h3 {
      font-size: 20px;
    }
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    gap: 15px;
    padding: 20px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;

  label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1b5e20;
  }

  select {
    padding: 12px 16px;
    border: 2px solid #e8f5e8;
    border-radius: 12px;
    font-size: 14px;
    background: white;
    color: #1b5e20;
    transition: all 0.3s ease;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    &:hover {
      border-color: #4caf50;
    }
  }

  @media (max-width: 768px) {
    min-width: 150px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 15px 25px;
  background: ${({ active }) => 
    active 
      ? "rgba(255, 255, 255, 0.98)" 
      : "rgba(255, 255, 255, 0.15)"
  };
  color: ${({ active }) => (active ? "#1b5e20" : "white")};
  border: 1px solid ${({ active }) => 
    active 
      ? "#4caf50" 
      : "rgba(255, 255, 255, 0.2)"
  };
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: rgba(255, 255, 255, 0.98);
    color: #1b5e20;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(45, 125, 50, 0.2);
    border-color: #4caf50;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 13px;
  }
`;

export const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: #000200;
      font-size: 24px;
      font-weight: 700;
    }

    .table-actions {
      span {
        color: #000200;
        font-size: 14px;
        padding: 8px 16px;
        background: #e8f5e8;
        border-radius: 20px;
        font-weight: 500;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    
    .table-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;

      h2 {
        font-size: 20px;
      }
    }
  }
`;

export const ResponsiveTable = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f8e9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #a5d6a7;
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;

  th {
    background: linear-gradient(135deg, #4caf50);
    color: white;
    padding: 18px 15px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;

    &:first-child {
      border-top-left-radius: 12px;
    }

    &:last-child {
      border-top-right-radius: 12px;
    }
  }

  td {
    padding: 18px 15px;
    font-size: 14px;
    border-bottom: 1px solid #e8f5e8;
    transition: background-color 0.2s ease;
    color: #1b5e20;

    .badge-number {
      background: linear-gradient(135deg, #2d7d32, #4caf50);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  tbody tr {
    &:hover {
      background: #f1f8e9;
      cursor: pointer;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    min-width: auto;
    
    thead {
      display: none;
    }

    tbody tr {
      display: block;
      border: 1px solid #e8f5e8;
      border-radius: 12px;
      margin-bottom: 15px;
      padding: 15px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e8f5e8;

      &:before {
        content: attr(data-label);
        font-weight: 600;
        color: #1b5e20;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.5px;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  background: ${({ status }) =>
    status === "Enviado"
      ? "linear-gradient(135deg, #2d7d32, #4caf50)"
      : status === "Pendente"
      ? "linear-gradient(135deg, #f57c00, #ff9800)"
      : "linear-gradient(135deg, #616161, #757575)"};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1b5e20;
  }
`;

export const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #e8f5e8;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  color: #1b5e20;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  &:hover {
    border-color: #4caf50;
  }

  &::placeholder {
    color: #81c784;
  }
`;

export const Button = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, #2d7d32, #4caf50);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(45, 125, 50, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 125, 50, 0.4);
    background: linear-gradient(135deg, #1b5e20, #388e3c);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.secondary {
    background: linear-gradient(135deg, #757575, #9e9e9e);
    box-shadow: 0 4px 15px rgba(117, 117, 117, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(117, 117, 117, 0.4);
      background: linear-gradient(135deg, #616161, #757575);
    }
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(45, 125, 50, 0.15);
    border-color: #a5d6a7;
  }
`;

export const ProductCard = styled(Card)`
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .product-icon {
      font-size: 32px;
      padding: 12px;
      background: linear-gradient(135deg, #2d7d32, #4caf50);
      border-radius: 12px;
      color: white;
    }

    .product-code {
      background: #e8f5e8;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #1b5e20;
    }
  }

  h3 {
    margin: 0 0 15px 0;
    color: #1b5e20;
    font-size: 18px;
    font-weight: 700;
  }

  .product-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 12px;
    background: #f1f8e9;
    border-radius: 8px;

    .detail-label {
      font-size: 12px;
      color: #388e3c;
      font-weight: 600;
    }

    .detail-value {
      font-size: 14px;
      color: #1b5e20;
      font-weight: 600;
    }
  }

  .product-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
`;

export const DepartmentCard = styled(Card)`
  .department-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;

    .department-icon {
      font-size: 32px;
      padding: 12px;
      background: linear-gradient(135deg, #2d7d32, #4caf50);
      border-radius: 12px;
      color: white;
    }

    .department-title {
      flex: 1;

      h3 {
        margin: 0;
        color: #1b5e20;
        font-size: 18px;
        font-weight: 700;
      }

      .department-branch {
        font-size: 12px;
        color: #388e3c;
        font-weight: 600;
      }
    }
  }

  .department-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;

    .stat {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      background: #f1f8e9;
      border-radius: 12px;

      .stat-icon {
        font-size: 24px;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #1b5e20;
      }

      .stat-label {
        font-size: 12px;
        color: #388e3c;
        font-weight: 600;
      }
    }
  }

  .department-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

.department-products {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    
    h4 {
      margin-bottom: 8px;
      font-size: 14px;
      color: #555;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 10px 0;
      
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px dashed #eee;
      }
    }
    
    select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
  }
  
`;

export const IconButton = styled.button`
  padding: 8px;
  background: #f1f8e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  color: #388e3c;

  &:hover {
    background: #e8f5e8;
    transform: scale(1.05);
    border-color: #4caf50;
  }

  &.danger {
    &:hover {
      background: #ffebee;
      border-color: #ef5350;
      color: #d32f2f;
    }
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid #e8f5e8;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 0 25px;

  h2 {
    margin: 0;
    color: #1b5e20;
    font-size: 22px;
    font-weight: 700;
  }
`;

export const ModalBody = styled.div`
  padding: 25px;
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 0 25px 25px 25px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #388e3c;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #e8f5e8;
    color: #1b5e20;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #388e3c;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.6;
  }

  h3 {
    margin: 0 0 10px 0;
    color: #1b5e20;
    font-size: 20px;
  }

  p {
    margin: 0 0 30px 0;
    font-size: 14px;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  &::after {
    content: "";
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d7d32, #4caf50);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(45, 125, 50, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
  display: none;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(45, 125, 50, 0.5);
    background: linear-gradient(135deg, #1b5e20, #388e3c);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;


