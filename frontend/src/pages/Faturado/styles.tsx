import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

export const Header = styled.div`
  margin-bottom: 30px;
  
  h1 {
    color: #333;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
  }
  
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow-x: auto;
  margin-bottom: 30px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background-color: #f5f5f5;
    
    th {
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      color: #444;
      border-bottom: 2px solid #ddd;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid #eee;
      
      &:hover {
        background-color: #f9f9f9;
      }
    }
    
    td {
      padding: 12px 15px;
      color: #555;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
`;

export const Button = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ secondary }) => secondary ? `
    background-color: #f5f5f5;
    color: #555;
    
    &:hover {
      background-color: #e9e9e9;
    }
  ` : `
    background-color: #4a90e2;
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
    }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: #666;
  margin: 20px 0;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

export const ProductsSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;

  h3 {
    margin-bottom: 15px;
    color: #333;
  }
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

export const ProductCard = styled.div`
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  .product-code {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .product-name {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .product-description {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .product-values {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #444;
  }
`;