# Malaysia JPJ KPP01 Theory Test Practice in English

Practise for Malaysia’s computerised driving theory test (*ujian komputer lesen memandu*) with an offline English quiz for **KPP Gabungan**, the combined car and motorcycle syllabus. This study pack includes **469 practice questions**, a **70-question timed mock exam**, and a printable **A4 road signs and numbers revision sheet**.

Release snapshot dated **22 November 2026**.

[Download the offline ZIP](https://github.com/HiGarethDavies/jpj-kpp01-english/releases/latest)

## Start studying

1. Download and extract the ZIP.
2. Open [index.html](index.html) from the extracted folder in a regular browser window. No installation or account is required.
3. Start with road signs, road rules, licence and KEJARA drills, or go straight to the mock. Mark uncertain answers for review. In the mock, you can change your choice before moving to the next question.
4. Open or print the [A4 revision sheet](JPJ-KPP01-Revision-Sheet.pdf) for sign shapes and colours, licence deadlines, following distances, demerit points and alcohol limits.

## What the mock covers

The [official JPJ KPP Gabungan FAQ](https://www.jpj.gov.my/wp-content/uploads/2025/10/FAQ-KPP-GABUNGAN-NEW.pdf) lists **70 theory questions, 75 minutes and 56 correct answers to pass**. The mock uses that length and time with an independent mix of signs, markings, defensive driving, vehicle checks, motorcycle basics, licence rules and KEJARA demerit points. Question wording and topic distribution can differ from the actual exam.

Learning drills give feedback after you check an answer. The timed mock holds feedback until the end. The dashboard links to [MyDIIMS colour-vision practice](https://kpped.com/bw/), which runs on an external site and requires internet access.

## Offline use and privacy

JavaScript, styles, questions and sign illustrations are embedded in the HTML. The quiz makes no network requests during normal practice. There is **no backend, cloud storage, account, analytics, advertising or tracking**. Optional external links open only when clicked. Those sites have their own privacy practices.

Answers, review history and paused sessions are stored in your browser’s `localStorage`. The app never uploads or syncs them. Use the same file location and browser profile when you return. Moving the file, clearing browser data, private browsing or switching devices can affect whether previous progress is available. Local-file storage support varies by browser. You can copy a plain-text progress report for your own records.

## Source and build

- [index.html](index.html) is the ready-to-use quiz.
- [JPJ-KPP01-Revision-Sheet.pdf](JPJ-KPP01-Revision-Sheet.pdf) is the printable guide.
- [src/](src/) contains the app, question bank, illustrations and build scripts.

Run `node src/build.cjs` and `node src/check.cjs` from the repo root. Node.js 20 or later is sufficient and there are no npm dependencies. To regenerate the PDF, use Python with ReportLab installed and run `python src/build_revision_sheet.py`.

## References and limits

This is an independent revision aid assembled on a best-effort basis. It contains independently written practice questions and simplified sign drawings. JPJ does not endorse or supply this question bank. A practice score does not guarantee a pass. Use current JPJ materials and your driving institute’s instructions for your booking.

- [JPJ KPP Gabungan textbook](https://www.jpj.gov.my/wp-content/uploads/2025/10/Buku-KPP-Gabungan-Motokar-Dan-Motosikal.pdf)
- [JPJ driving licence FAQ](https://www.jpj.gov.my/en/faq-driving/)
- [JPJ KEJARA FAQ](https://www.jpj.gov.my/pusat-media-3/soalan-lazim/soalan-lazim-kejara/)
- [JKR standard traffic signs manual](https://epsmg.jkr.gov.my/images/8/81/ATJ_2A.85_P_2019-WM.pdf)
