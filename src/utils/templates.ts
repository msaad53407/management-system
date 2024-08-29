export const getMeetingTemplates = (editor: any) => [
  {
    type: "menuitem",
    text: "Minutes Template",
    onAction: () => {
      editor?.resetContent();
      editor?.insertContent(`
          <div style="width: 100%; display: flex; justify-content: center;">
            <img src="../../../upload/logo.png" width="200" height="200">
          </div>
          <h3 style="text-align: center;">[ChapterName] Chapter #[ChapterNumber]</h3>
          <h3 style="text-align: center;">Regular Communication Meeting Minutes</h3>
          <h3 style="text-align: center;">
            <strong>Worthy Matron Walter Easley Presiding</strong>
          </h3>
          <h3 style="text-align: center;">
            <strong>Date:</strong> [calendar picker] @ [time picker]
          </h3>
          <h4>Roll Call of Officers:</h4>
          <ul>
            <li>
              <strong>Worthy Matron:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Worthy Patron:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Associate Matron:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Associate Patron:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Treasurer:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Secretary:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Conductress:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Associate Conductress:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
            <li>
              <strong>Chairman of Trustees:</strong> [Chapter Office &ndash; First and Last Name]
            </li>
          </ul>
          <p>[ChapterName] Chapter #[ChapterNumber] was opened in due and ritualistic form @ [time selected above].</p>
          <h4>Visiting Sisters/Brothers present during this communication were as follows:</h4>
          <h4>Agenda Items:</h4>
          <ol>
            <li>
              <strong>Sick and Distressed:</strong><br>Please remember the following individuals in our prayers:<br><br><br><br>
            </li>
            <li>
              <strong>New Petitions for Membership:</strong><br>
              <ul>
                <li>
                  <strong><br><br></strong>
                </li>
              </ul>
            </li>
            <li>
              <strong>Delinquent Members:</strong><br>
              <ul>
                <li>
                  <strong><br><br></strong>
                </li>
              </ul>
            </li>
            <li>
              <strong>Communications (Grand Chapter &amp; Local):</strong><br>
              <ul>
                <li>
                <strong><br><br></strong>
                </li>
              </ul>
            </li>
            <li>
              <strong>Old Business/New Business:</strong>
              <ul>
                <li><br><br><br></li>
              </ul>
            </li>
            <li>
              <strong>Committee Reports:</strong><br>
              <ul>
                <li>Investigation<br><br><br></li>
                <li>Community Service<br><br><br></li>
                <li>Secretaries Report<br><br><br></li>
                <li>Treasurers Report<br><br><br></li>
                <li>Fundraiser Report<br><br><br></li>
              </ul>
            </li>
            <li>
              <strong>For The Good of the Order:</strong>
            </li>
          </ol>
          <p>[ChapterName] Chapter #[ChapterNumber] was closed in due and ritualistic form @ [time].</p>
          <h4>Receipts</h4>
          <p>
            <strong>Cash Account Receipts</strong>
          </p>
          <ul>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
            <li>____________ - $______ Description:</li>
          </ul>
          <p><strong>Total Receipts:</strong> $</p>
          <h4>Expenses Presented and Ordered Paid</h4>
          <ul>
            <li>___________ - $__________ Description:</li>
            <li>___________ - $__________ Description:</li>
            <li>___________ - $__________ Description:</li>
            <li>___________ - $__________ Description:</li>
            <li>___________ - $__________ Description:</li>
            </ul>
          <p>
            <strong>Total Expenses:</strong> $
          </p>
`);
    },
  },
];
