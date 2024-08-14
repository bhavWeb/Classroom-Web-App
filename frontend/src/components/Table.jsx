import React from 'react';

const Table = ({ headers, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="py-2 px-4">{header}</th>
            ))}
            {actions && <th className="py-2 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="bg-gray-100 border-b">
              {Object.values(row).map((value, i) => (
                <td key={i} className="py-2 px-4">{value}</td>
              ))}
              {actions && (
                <td className="py-2 px-4">
                  {/* Edit and Delete buttons */}
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
