from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'JPJ-KPP01-Revision-Sheet.pdf'
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 38
WIDTH = PAGE_WIDTH - 2 * MARGIN
SPLIT = 258
INK = HexColor('#162537')
BLUE = HexColor('#16546A')
MUTED = HexColor('#42586B')
FAINT = HexColor('#D7E3EA')
TINT = HexColor('#EDF5F8')
PALE = HexColor('#F6F9FB')

BOOK = 'https://www.jpj.gov.my/wp-content/uploads/2025/10/Buku-KPP-Gabungan-Motokar-Dan-Motosikal.pdf'
EXAM = 'https://www.jpj.gov.my/wp-content/uploads/2025/10/FAQ-KPP-GABUNGAN-NEW.pdf'
KEJARA = 'https://www.jpj.gov.my/pusat-media-3/soalan-lazim/soalan-lazim-kejara/'
LICENSING = 'https://www.jpj.gov.my/accordions/soalan-lazim-lesen-memandu-7/'
LDL = 'https://www.jpj.gov.my/en/learn-to-drive-license-application-ldl/'
CDL = 'https://www.jpj.gov.my/permohonan-lesen-memandu-kompeten-cdl/'
ACT = 'https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/1684461_BI/Act%20A1618.pdf'
JKR_SIGNS = 'https://epsmg.jkr.gov.my/images/8/81/ATJ_2A.85_P_2019-WM.pdf'

SIGN_GUIDE = [
    ('limit', 'Red ring', '<b>Limit or ban</b><br/>Speed or width limit.<br/>No U-turn.'),
    ('keep-left', 'Blue circle', '<b>Mandatory action</b><br/>Follow the arrow.'),
    ('hospital', 'Blue box', '<b>Often information</b><br/>White H marks a hospital.'),
    ('junction', 'Yellow diamond', '<b>Warning</b><br/>Bend, junction, hump.'),
    ('roadworks', 'Orange sign', '<b>Temporary</b><br/>Roadworks or lane closure.'),
]

SECTIONS = [
    ('Following, scanning and overtaking', [
        ('Following gap in normal conditions?', '<b>2 seconds</b>.'),
        ('Gap in rain, on slick roads, towing or tailgated?', '<b>4 seconds</b> between you and the vehicle ahead.'),
        ('How far ahead to scan, including before overtaking?', '<b>12 seconds</b> ahead.'),
        ('Signal before pulling out or returning after a pass?', 'At least <b>3 seconds</b> before moving.'),
        ('Minimum side clearance in the KPP overtaking rule?', 'At least <b>1 metre</b>.'),
    ], 'Two when clear, four when it pours, twelve to see what’s in store.'),
    ('Licences and eyesight', [
        ('Minimum age for car (D/DA) and motorcycle?', 'Car <b>17 years</b>. Motorcycle <b>16 years</b>.'),
        ('Eyesight distance for a licence applicant?', '<b>23 metres</b>.'),
        ('Part I pass valid for LDL for how long?', '<b>1 year</b> from the Part I test.'),
        ('L licence (LDL) renewal and maximum total?', '<b>3 or 6 months</b> at a time, up to <b>2 years</b> from first issue.'),
        ('P licence (PDL) probation period?', '<b>2 years</b>.'),
        ('P licence to full licence (CDL) application window?', 'From <b>7 days before</b> expiry to <b>1 year after</b> expiry.'),
    ], None),
    ('KEJARA demerit points', [
        ('When are points counted for a scheduled offence?', 'When the <b>compound is paid</b> or a <b>court imposes a penalty</b>.'),
        ('How many points can lead to P licence cancellation?', '<b>20 points</b> or more.'),
        ('Repeated suspensions that can cancel a full licence?', '<b>3 suspensions within 5 years</b>.'),
        ('When can you reapply after KEJARA cancellation?', '<b>12 months after cancellation</b>.'),
        ('How much can points be reduced in qualifying cases?', '<b>50%</b>. One route is <b>12 months without a scheduled offence</b>.'),
    ], None),
    ('General alcohol limits per 100 mL', [
        ('Breath', '<b>22 microgrammes</b> per 100 mL of breath.'),
        ('Blood (BAC)', '<b>50 milligrammes</b> per 100 mL of blood.'),
        ('Urine', '<b>67 milligrammes</b> per 100 mL of urine.'),
    ], 'Breathe two tiny twos. Blood flows at fifty. Sixty-seven goes down the loo. Tiny = microgrammes.'),
]


def make_paragraph(text, *, colour, size=10, leading=12):
    style = ParagraphStyle('cell', fontName='Helvetica', fontSize=size,
                           leading=leading, textColor=colour)
    return Paragraph(text.replace('’', "'"), style)


def draw_sign(pdf, kind, x, y):
    pdf.saveState()
    pdf.translate(x, y)
    pdf.setFillColor(INK)
    if kind == 'limit':
        pdf.setLineWidth(2.5)
        pdf.setStrokeColor(HexColor('#BF272D'))
        pdf.setFillColor(white)
        pdf.circle(0, 0, 11, stroke=1, fill=1)
        pdf.setFillColor(INK)
        pdf.setFont('Helvetica-Bold', 10)
        pdf.drawCentredString(0, -3.5, '60')
    elif kind == 'keep-left':
        pdf.setFillColor(HexColor('#14559A'))
        pdf.circle(0, 0, 12, stroke=0, fill=1)
        pdf.setStrokeColor(white)
        pdf.setLineWidth(2.2)
        pdf.lines([(5, 5, -5, -5), (-5, 1, -5, -5), (-5, -5, 1, -5)])
    elif kind == 'hospital':
        pdf.setFillColor(HexColor('#14559A'))
        pdf.rect(-12, -11, 24, 22, stroke=0, fill=1)
        pdf.setFillColor(white)
        pdf.setFont('Helvetica-Bold', 15)
        pdf.drawCentredString(0, -5.4, 'H')
    elif kind == 'junction':
        pdf.setStrokeColor(INK)
        pdf.setFillColor(HexColor('#FFD33D'))
        diamond = pdf.beginPath()
        diamond.moveTo(0, 13)
        diamond.lineTo(13, 0)
        diamond.lineTo(0, -13)
        diamond.lineTo(-13, 0)
        diamond.close()
        pdf.drawPath(diamond, stroke=1, fill=1)
        pdf.setLineWidth(2.1)
        pdf.lines([(-6, 0, 6, 0), (0, -6, 0, 6)])
    elif kind == 'roadworks':
        pdf.setStrokeColor(INK)
        pdf.setFillColor(HexColor('#FF9A39'))
        pdf.rect(-15, -9, 30, 18, stroke=1, fill=1)
        pdf.setFillColor(INK)
        pdf.setFont('Helvetica-Bold', 6.8)
        pdf.drawCentredString(0, -2.5, 'AWAS')
    pdf.restoreState()


def draw_sign_guide(pdf, y):
    pdf.setFillColor(BLUE)
    pdf.setFont('Helvetica-Bold', 11.4)
    pdf.drawString(MARGIN, y - 10, 'Road signs')
    pdf.setFont('Helvetica', 9.4)
    pdf.drawString(MARGIN + 71, y - 10, 'Read the shape, colour and symbol together.')
    y -= 16
    gap = 6
    tile_width = (WIDTH - gap * (len(SIGN_GUIDE) - 1)) / len(SIGN_GUIDE)
    for column, (kind, label, meaning) in enumerate(SIGN_GUIDE):
        x = MARGIN + column * (tile_width + gap)
        pdf.setFillColor(PALE)
        pdf.roundRect(x, y - 76, tile_width, 76, 4, fill=1, stroke=0)
        draw_sign(pdf, kind, x + tile_width / 2, y - 16)
        pdf.setFillColor(BLUE)
        pdf.setFont('Helvetica-Bold', 9.6)
        pdf.drawString(x + 7, y - 37, label)
        body = make_paragraph(meaning, colour=INK, size=9, leading=10.3)
        _, height = body.wrap(tile_width - 14, 30)
        body.drawOn(pdf, x + 7, y - 40 - height)

    extra = make_paragraph(
        '<b>BERHENTI</b> (red octagon) = stop. <b>BERI LALUAN</b> (inverted triangle) = give way.<br/>'
        'On divided road signs, a divider at the <b>top</b> means begins. At the <b>bottom</b> means ends.',
        colour=MUTED, size=9.2, leading=11,
    )
    extra.wrap(WIDTH, 25)
    extra.drawOn(pdf, MARGIN, y - 102)
    return y - 109


def draw_sheet():
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle('KPP01 Gabungan - Numbers and Road Signs')
    pdf.setAuthor('KPP01 revision notes')

    pdf.setFillColor(BLUE)
    pdf.rect(MARGIN, PAGE_HEIGHT - 37, 27, 3, fill=1, stroke=0)
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawString(MARGIN + 36, PAGE_HEIGHT - 39, 'KPP01 GABUNGAN')
    pdf.setFillColor(INK)
    pdf.setFont('Helvetica-Bold', 31)
    pdf.drawString(MARGIN, PAGE_HEIGHT - 73, 'Numbers and road signs')
    pdf.setFont('Helvetica', 11)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, PAGE_HEIGHT - 91, 'Cover the answers and say each number and unit aloud.')

    y = PAGE_HEIGHT - 104
    pdf.setFillColor(TINT)
    pdf.roundRect(MARGIN, y - 26, WIDTH, 26, 5, fill=1, stroke=0)
    exam = make_paragraph('<b>70 questions</b> &nbsp; / &nbsp; <b>75 minutes</b> &nbsp; / &nbsp; <b>56 correct to pass</b>', colour=BLUE, size=10.5)
    exam.wrap(WIDTH - 20, 26)
    exam.drawOn(pdf, MARGIN + 11, y - 20)
    pdf.linkURL(EXAM, (MARGIN, y - 26, MARGIN + WIDTH, y), relative=0)
    y -= 35
    y = draw_sign_guide(pdf, y)

    for name, rows, mnemonic in SECTIONS:
        pdf.setFillColor(BLUE)
        pdf.setFont('Helvetica-Bold', 11.4)
        pdf.drawString(MARGIN, y - 13, name)
        y -= 19
        for index, (prompt, answer) in enumerate(rows):
            question = make_paragraph(prompt, colour=MUTED)
            response = make_paragraph(answer, colour=INK)
            _, question_height = question.wrap(SPLIT - 22, 200)
            _, response_height = response.wrap(WIDTH - SPLIT - 18, 200)
            height = max(question_height, response_height) + 4
            if index % 2 == 0:
                pdf.setFillColor(PALE)
                pdf.rect(MARGIN, y - height, WIDTH, height, fill=1, stroke=0)
            pdf.setStrokeColor(FAINT)
            pdf.setLineWidth(0.45)
            pdf.line(MARGIN, y - height, MARGIN + WIDTH, y - height)
            question.drawOn(pdf, MARGIN + 9, y - (height + question_height) / 2)
            response.drawOn(pdf, MARGIN + SPLIT + 6, y - (height + response_height) / 2)
            y -= height
        if mnemonic:
            pdf.setFillColor(TINT)
            pdf.roundRect(MARGIN, y - 25, WIDTH, 21, 4, fill=1, stroke=0)
            memory = make_paragraph(f'<b>{mnemonic}</b>', colour=BLUE, size=10.1)
            memory.wrap(WIDTH - 20, 21)
            memory.drawOn(pdf, MARGIN + 9, y - 21)
            y -= 27
        y -= 7

    if y < 68:
        raise RuntimeError(f'Page content overlaps the source footer at {y:.1f} points')
    pdf.setStrokeColor(FAINT)
    pdf.line(MARGIN, 64, MARGIN + WIDTH, 64)
    footer_style = ParagraphStyle('source', fontName='Helvetica', fontSize=8.4,
                                  leading=12, textColor=MUTED)
    links = [
        ('JPJ book', BOOK), ('Licence FAQ', LICENSING), ('LDL application', LDL), ('CDL conversion', CDL),
        ('KEJARA FAQ', KEJARA), ('Road Transport Act 45G', ACT), ('JKR signs', JKR_SIGNS),
    ]
    sources = ' &nbsp; / &nbsp; '.join(f'<link href="{url}" color="#16546A">{label}</link>' for label, url in links)
    footer = Paragraph(f'<b>Sources</b> &nbsp; {sources}', footer_style)
    footer.wrap(WIDTH, 24)
    footer.drawOn(pdf, MARGIN, 45)
    pdf.showPage()
    pdf.save()
    print(f'{OUTPUT} | A4 | content ends at {y:.1f} points')


if __name__ == '__main__':
    make_dir = OUTPUT.parent
    make_dir.mkdir(exist_ok=True)
    draw_sheet()
