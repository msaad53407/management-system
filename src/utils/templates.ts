import { ChapterDocument } from "@/models/chapter";
import { User } from "@clerk/nextjs/server";

export const getMeetingTemplates = (
  editor: any,
  templateDataChapter: {
    chapter: ChapterDocument;
    matron: User;
  }
) => {
  return [
    {
      type: "menuitem",
      text: "Minutes Template",
      onAction: () => {
        editor?.resetContent();
        editor?.insertContent(`
            <div style="width: 100%; display: flex; justify-content: center;">
              <img src="../../../upload/logo.png" width="200" height="200">
            </div>
            <h3 style="text-align: center;">${templateDataChapter.chapter.name} Chapter #${templateDataChapter.chapter.chapterNumber}</h3>
            <h3 style="text-align: center;">Regular Communication Meeting Minutes</h3>
            <h3 style="text-align: center;">
              <strong>Worthy Matron ${templateDataChapter.matron.firstName} ${templateDataChapter.matron.lastName} Presiding</strong>
            </h3>
            <h3 style="text-align: center;">
              <strong>Date:</strong> [calendar picker] @ [time picker]
            </h3>
            <h4>Roll Call of Officers:</h4>
            <ul>
              <li className="list-item">
                <strong>Worthy Matron:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Worthy Patron:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Associate Matron:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Associate Patron:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Treasurer:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Secretary:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Conductress:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Associate Conductress:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
              <li className="list-item">
                <strong>Chairman of Trustees:</strong> [Chapter Office &ndash; First and Last Name]
              </li>
            </ul>
            <p>${templateDataChapter.chapter.name} Chapter #${templateDataChapter.chapter.chapterNumber} was opened in due and ritualistic form @ [time selected above].</p>
            <h4>Visiting Sisters/Brothers present during this communication were as follows:</h4>
            <h4>Agenda Items:</h4>
            <ol>
              <li className="list-item">
                <strong>Sick and Distressed:</strong><br>Please remember the following individuals in our prayers:<br><br><br><br>
              </li>
              <li className="list-item">
                <strong>New Petitions for Membership:</strong><br>
                <ul>
                  <li className="list-item">
                    <strong><br><br></strong>
                  </li>
                </ul>
              </li>
              <li className="list-item">
                <strong>Delinquent Members:</strong><br>
                <ul>
                  <li className="list-item">
                    <strong><br><br></strong>
                  </li>
                </ul>
              </li>
              <li className="list-item">
                <strong>Communications (Grand Chapter &amp; Local):</strong><br>
                <ul>
                  <li className="list-item">
                  <strong><br><br></strong>
                  </li>
                </ul>
              </li>
              <li className="list-item">
                <strong>Old Business/New Business:</strong>
                <ul>
                  <li className="list-item"><br><br><br></li>
                </ul>
              </li>
              <li className="list-item">
                <strong>Committee Reports:</strong><br>
                <ul>
                  <li className="list-item">Investigation<br><br><br></li>
                  <li className="list-item">Community Service<br><br><br></li>
                  <li className="list-item">Secretaries Report<br><br><br></li>
                  <li className="list-item">Treasurers Report<br><br><br></li>
                  <li className="list-item">Fundraiser Report<br><br><br></li>
                </ul>
              </li>
              <li className="list-item">
                <strong>For The Good of the Order:</strong>
              </li>
            </ol>
            <p>${templateDataChapter.chapter.name} Chapter #${templateDataChapter.chapter.chapterNumber} was closed in due and ritualistic form @ [time].</p>
            <h4>Receipts</h4>
            <p>
              <strong>Cash Account Receipts</strong>
            </p>
            <ul>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
              <li className="list-item">____________ - $______ Description:</li>
            </ul>
            <p><strong>Total Receipts:</strong> $</p>
            <h4>Expenses Presented and Ordered Paid</h4>
            <ul>
              <li className="list-item">___________ - $__________ Description:</li>
              <li className="list-item">___________ - $__________ Description:</li>
              <li className="list-item">___________ - $__________ Description:</li>
              <li className="list-item">___________ - $__________ Description:</li>
              <li className="list-item">___________ - $__________ Description:</li>
              </ul>
            <p>
              <strong>Total Expenses:</strong> $
            </p>
  `);
      },
    },
  ];
};
