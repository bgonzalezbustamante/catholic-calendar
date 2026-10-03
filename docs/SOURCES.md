# Sources and rule notes

This proof of concept uses a deliberately small, documented rule set rather than attempting to reproduce every national, diocesan or religious proper calendar.

## Primary framework

### Liturgical year and precedence

- **Universal Norms on the Liturgical Year and the Calendar** — the basis for the seasonal cycle, the Table of Liturgical Days and the principle that the higher-ranking celebration is observed when celebrations coincide.
  - USCCB overview: https://www.usccb.org/prayer-worship/liturgical-year
  - England and Wales Liturgy Office table of liturgical days: https://www.liturgyoffice.org.uk/Calendar/Info/Days.shtml

The engine encodes only the portions of the precedence table needed by the curated observance set. It is not a general-purpose Ordo generator.

### Popular piety and devotional periods

- **Directory on Popular Piety and the Liturgy**, especially the principle that the liturgical year takes priority over devotional practices: https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20020513_vers-direttorio_en.html

This is why St Michael’s Lent is represented as `devotional`, never as a Roman liturgical season.

## Movable dates

### Easter cycle

Gregorian Easter is calculated algorithmically. The selected movable dates are then expressed as offsets from Easter Sunday:

- Ash Wednesday: −46 days
- Palm Sunday: −7
- Holy Thursday: −3
- Good Friday: −2
- Holy Saturday: −1
- Second Sunday of Easter / Divine Mercy Sunday: +7
- Ascension: +39
- Pentecost: +49
- Mary, Mother of the Church: +50
- Trinity Sunday: +56
- Corpus Christi: +60
- Sacred Heart: +68
- Immaculate Heart: +69

The PoC uses the universal Thursday dates for Ascension and Corpus Christi rather than national Sunday transfers.

### Advent

The First Sunday of Advent is derived as the Sunday occurring from 27 November through 3 December. Christ the King is the immediately preceding Sunday. Advent runs from the First Sunday of Advent through 24 December at civil-date granularity.

## Transfers and collisions

### General rule

Universal Norms no. 60 provide that a solemnity impeded by a higher-ranking liturgical day is transferred to the nearest eligible day; other lower-ranking celebrations are omitted for that year. The PoC preserves those lower-ranking selected dates as `impeded` diagnostic entries rather than deleting them from the data model.

### Saint Joseph

The Liturgy Office guidance records:

- a Sunday-in-Lent occurrence is transferred to Monday;
- Palm Sunday / Holy Week occurrences are anticipated to the nearest available day, generally the Saturday before Palm Sunday.

Reference: https://www.liturgyoffice.org.uk/Calendar/Sunday/OT2Solemnities.shtml

The 2008 calendar note documents the exceptional Holy Week arrangement: https://liturgyoffice.org.uk/Calendar/Info/Ordo2008.pdf

### Annunciation

The same guidance records transfer to Monday when 25 March falls on a Sunday of Lent, and transfer after the Second Sunday of Easter when impeded by Palm Sunday, Holy Week, Easter Sunday or the Easter Octave.

Reference: https://www.liturgyoffice.org.uk/Calendar/Sunday/OT2Solemnities.shtml

The 2024 transfer to 8 April provides a regression case.

### Immaculate Conception

When 8 December falls on a Sunday of Advent, the solemnity is transferred to Monday. The 2024 calendar provides a regression case.

### Selected solemnity collisions

In 2022 the Sacred Heart and the Nativity of Saint John the Baptist both fell on 24 June. The Holy See kept the solemnity of the Lord on 24 June and anticipated Saint John to 23 June (outside places where Saint John had a proper higher status).

Reference: https://www.liturgyoffice.org.uk/Calendar/2022/Ordo-2022.pdf

The alpha generalises this pattern only within the selected solemnity set by preferring celebrations of the Lord, then Marian solemnities, then saints, and transferring the lower selected solemnity to the closest eligible date, preferring the preceding date on an equal-distance tie. This is a pragmatic PoC rule and should be reviewed before the engine is presented as a complete canonical calendar library.

## Marian additions

The curated set includes universal Marian observances relevant to the intended site display, including:

- Our Lady of Lourdes — 11 February, optional memorial.
- Our Lady of Fatima — 13 May, optional memorial; represented from 2002 in this PoC.
- Our Lady of Mount Carmel — 16 July, optional memorial.
- Our Lady of Guadalupe — 12 December, optional memorial in the General Roman Calendar; represented from 2002 in this PoC.
- Blessed Virgin Mary, Mother of the Church — Monday after Pentecost; represented from 2018.

Holy See notification for Mary, Mother of the Church: https://www.vatican.va/content/dam/wss/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20180324_notificazione-mater-ecclesiae_en.html

## Spanish observance names

Spanish labels in the Year Overview follow standard Spanish-language Roman Catholic usage, cross-checked against Holy See and Vatican News Spanish materials. Examples include `Santísimo Cuerpo y Sangre de Cristo`, `Conmemoración de todos los fieles difuntos`, `Nuestro Señor Jesucristo, Rey del Universo`, `Inmaculada Concepción` and `Natividad del Señor`.

References:
- Holy See, Code of Canon Law (Spanish), can. 1246: https://www.vatican.va/archive/cod-iuris-canonici/esp/documents/cic_libro4_cann1246-1248_sp.html
- Vatican News, liturgical feasts index: https://www.vaticannews.va/es/fiestas-liturgicas.html
- Holy See / Vatican News Spanish liturgical celebration pages for All Saints, the faithful departed, Christ the King, Immaculate Conception and Christmas.

The public `name` field remains English for backwards compatibility; `nameEs` carries the Spanish display name.

## St Michael’s Lent

St Michael’s Lent is a Franciscan devotional practice, not a liturgical season. The PoC represents the civil-date span from the Assumption (15 August) through the feast of Saints Michael, Gabriel and Raphael (29 September) inclusive and deliberately does not assign a numbered “day of Lent”.

Franciscan references:

- Secular Franciscan Order – USA: https://www.secularfranciscansusa.org/2022/08/st-michaels-lent-august-15th-to-september-29th/
- Franciscan Tradition: https://www.franciscantradition.org/blog/the-five-lents-of-francis-vjkyuy/

## Intentional limits of v0.1.0-alpha.1

The alpha does **not** yet implement:

- national, diocesan, parish or religious-order proper calendars;
- conference-level transfers of Epiphany, Ascension or Corpus Christi;
- every celebration in the General Roman Calendar;
- complete historical calendar changes before the current rule set;
- time-of-day boundaries for the beginning of the Paschal Triduum;
- first-vespers concurrency rules;
- local holy-day-of-obligation rules.

These limits are explicit so later packaging work can distinguish stable calendar-engine behaviour from features that require configurable jurisdictional profiles.
