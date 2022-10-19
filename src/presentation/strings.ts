import Dict = NodeJS.Dict;

export const resultStatusDict: Dict<{ title: string; description: string; class: string }> = {
    requestError: {
        title: 'ERROR: REQUEST',
        description: 'An error occurred while sending the request',
        class: 'failed',
    },
    decodeError: {
        title: 'ERROR: DECODE',
        description: 'An error occurred while decoding the received data',
        class: 'failed',
    },
    postRequestError: {
        title: 'ERROR: POST-REQUEST',
        description: 'An error occurred while executing the post-request validation function',
        class: 'failed',
    },
    success: {
        title: 'SUCCESS',
        description: 'Test finished successfully',
        class: 'success',
    },
};

export const cssString: string =
    "body {\n" +
    "            padding: 1em;\n" +
    "            margin: 0;\n" +
    "            height: 100%;\n" +
    "            font-family: 'Roboto', sans-serif;\n" +
    "        }\n" +
    "\n" +
    "        details {\n" +
    "            margin-bottom: 1em;\n" +
    "        }\n" +
    "\n" +
    "        h1 {\n" +
    "            display: inline;\n" +
    "            font-size: 1.5em;\n" +
    "            margin: 0.67em 0;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "\n" +
    "\n" +
    "        table {\n" +
    "            table-layout: fixed;\n" +
    "            width: 100%;\n" +
    "            border-spacing: 0 0.5em;\n" +
    "            font-size: 1em;\n" +
    "            border: none;\n" +
    "        }\n" +
    "\n" +
    "\n" +
    "        td, th {\n" +
    "            word-wrap: break-word;\n" +
    "            text-align: left;\n" +
    "            padding: 5px;\n" +
    "        }\n" +
    "\n" +
    "\n" +
    "        td {\n" +
    "            overflow: auto;\n" +
    "            text-overflow: clip;\n" +
    "            color: #383838;\n" +
    "        }\n" +
    "\n" +
    "        th {\n" +
    "            background: #383838;\n" +
    "            color: #ffffff;\n" +
    "        }\n" +
    "\n" +
    "        tr:hover {\n" +
    "            background-color: #ececec;\n" +
    "        }\n" +
    "\n" +
    "        .post, .delete, .get, .put, .patch {\n" +
    "            text-align: center;\n" +
    "\n" +
    "            color: #ffffff;\n" +
    "            background-clip: padding-box;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "\n" +
    "        .get {\n" +
    "            color: #14c21c;\n" +
    "        }\n" +
    "\n" +
    "        .post {\n" +
    "            color: #cb8115;\n" +
    "        }\n" +
    "\n" +
    "        .put {\n" +
    "            color: #1396be;\n" +
    "        }\n" +
    "\n" +
    "        .patch {\n" +
    "            color: #9017cc;\n" +
    "        }\n" +
    "\n" +
    "        .delete {\n" +
    "            color: #d5154d;\n" +
    "        }\n" +
    "\n" +
    "        td:has(.success,.failed) {\n" +
    "            text-align: center;\n" +
    "        }\n" +
    "\n" +
    "        .success, .failed {\n" +
    "            font-size: 0.9em;\n" +
    "            display: inline-block;\n" +
    "            color: #ffffff;\n" +
    "            font-weight: normal;\n" +
    "            border-radius: 0.7em;\n" +
    "            padding: 0.4em;\n" +
    "        }\n" +
    "\n" +
    "        .description {\n" +
    "            width: 8%;\n" +
    "        }\n" +
    "\n" +
    "        .baseUrl {\n" +
    "            width: 16%;\n" +
    "        }\n" +
    "\n" +
    "        .endpoint {\n" +
    "            width: 16%;\n" +
    "        }\n" +
    "\n" +
    "        .status {\n" +
    "            text-align: center;\n" +
    "\n" +
    "            width: 13%;\n" +
    "        }\n" +
    "\n" +
    "        .method {\n" +
    "            text-align: center;\n" +
    "            width: 5%;\n" +
    "\n" +
    "        }\n" +
    "\n" +
    "        .error {\n" +
    "            height: auto;\n" +
    "        }\n" +
    "\n" +
    "        .dateTime {\n" +
    "            width: 8%;\n" +
    "\n" +
    "        }\n" +
    "\n" +
    "        .success {\n" +
    "            background-color: #077a12;\n" +
    "        }\n" +
    "\n" +
    "        .failed {\n" +
    "            background-color: #9a1111;\n" +
    "        }\n" +
    "\n" +
    "        input {\n" +
    "            width: 10em;\n" +
    "            background-image: url('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K');\n" +
    "            background-position: 10px 10px;\n" +
    "            border-radius: 10px;\n" +
    "\n" +
    "            background-repeat: no-repeat;\n" +
    "            margin: 8px 0;\n" +
    "            box-sizing: border-box;\n" +
    "            padding: 12px 20px 12px 40px;\n" +
    "\n" +
    "        }\n" +
    "\n" +
    "        input[type=text] {\n" +
    "            transition: width 0.4s ease-in-out;\n" +
    "        }\n" +
    "\n" +
    "        input[type=text]:focus {\n" +
    "            width: 100%;\n" +
    "        }\n" +
    "\n" +
    "        input[type=text]:not(:placeholder-shown) {\n" +
    "            width: 100%;\n" +
    "        }"

export const scriptString: string = "const searchFunction = () => {\n" +
    "        const trs = document.querySelectorAll('.sortable tbody>tr')\n" +
    "        const filter = document.querySelector('#searchInput').value\n" +
    "        const regex = new RegExp(filter, 'i')\n" +
    "        const isFoundInTds = td => regex.test(td.innerHTML)\n" +
    "        const isFound = childrenArr => childrenArr.some(isFoundInTds)\n" +
    "        const setTrStyleDisplay = ({style, children}) => {\n" +
    "            style.display = isFound([\n" +
    "                ...children\n" +
    "            ]) ? '' : 'none'\n" +
    "        }\n" +
    "        trs.forEach(setTrStyleDisplay)\n" +
    "    }"
