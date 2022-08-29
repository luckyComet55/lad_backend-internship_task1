export default (data) => {
    let insertData = "";
    for (let chunk of data) {
        insertData = insertData.concat(`\n<tr>
    <td>${chunk[0]}</td>
    <td>${chunk[1]}</td>
</tr>`)
    }
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        .table {
            width: 60%;
            margin-bottom: 20px;
            table-layout: fixed;
            border: 1px solid #dddddd;
            border-collapse: collapse;
            text-align: center;
        }

        .table th {
            font-weight: bold;
            padding: 5px;
            background: #efefef;
            border: 1px solid #dddddd;
        }

        .table td {
            border: 1px solid #dddddd;
            padding: 5px;
        }

        .table tbody tr:nth-child(odd) {
            background: #ffff;
        }

        .table tbody tr:nth-child(even) {
            background: #f7f7f7;
        }
    </style>
</head>
<body>
    <h1>Data Report</h1>
    <table class="table">
        <thead>
            <tr>
                <th>URL</th>
                <th>Most common words</th>
            </tr>
        </thead>
        <tbody>${insertData}
        </tbody>
    </table>
</body>
</html>`
}