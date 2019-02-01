<?xml version="1.0" encoding="UTF-8"?>
<sch:schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:sch="http://purl.oclc.org/dsdl/schematron">
	<sch:ns prefix="dh" uri="urn:dh" />
	<sch:ns prefix="xhtml" uri="http://www.w3.org/1999/xhtml" />

	<sch:pattern id="patt-test-2-xpath">
		<sch:rule context="xhtml:tr[@id='r2']/xhtml:td[1]" id="cell">
			<!-- node-name -->
			<sch:assert id="node-name-0" test="node-name() = 'td'">
				The element <name/> has valid expected name 'td'.
			</sch:assert>
			<sch:assert id="node-name-1" test="node-name(.) = 'td'">
				The element <name/> has valid expected name 'td'.
			</sch:assert>

			<!-- nilled -->
			<sch:assert id="nilled-0" test="not(nilled())">
				The element <name/> is not nill.
			</sch:assert>
			<sch:assert id="nilled-1" test="not(nilled(.))">
				The element <name/> is not nill.
			</sch:assert>

			<!-- string -->
			<sch:assert id="string-0" test="string() = 'Cell.2.1'">
				The element <name/> contains 'Cell.2.1'.
			</sch:assert>
			<sch:assert id="string-1" test="string(.) = 'Cell.2.1'">
				The element <name/> contains 'Cell.2.1'.
			</sch:assert>
			<sch:assert id="string-1-number" test="string(23) = '23'">
				`23` gets converted to string correctly.
			</sch:assert>
			<sch:assert id="string-1-false" test="string(false()) = 'false'">
				`false()` gets converted to string correctly.
			</sch:assert>
			<sch:assert id="string-1-string" test="string('Paris') = 'Paris'">
				`'Paris'` gets converted to string correctly.
			</sch:assert>

			<!-- data TODO -->
			
			<!-- base-uri TODO -->

			<!-- document-uri TODO -->
			
			<!-- error -->
			<sch:assert id="error-0" test="fn:error() or false()">
				Expected to throw.
			</sch:assert>
			<sch:assert id="error-1" test="fn:error(fn:QName('urn:dh', 'dh:expected-error')) or false()">
				Expected to throw.
			</sch:assert>
			<sch:assert id="error-2" test="fn:error(fn:QName('urn:dh', 'dh:expected-error'), 'expected to throw') or false()">
				Expected to throw.
			</sch:assert>
			<sch:assert id="error-3" test="fn:error(fn:QName('urn:dh', 'dh:expected-error'), 'expected to throw', .) or false()">
				Expected to throw.
			</sch:assert>
			
			<!-- trace -->
			<sch:assert id="trace-1" test="fn:trace('test') = 'test'">
				Should have signalled a trace with empty label.
			</sch:assert>
			<sch:assert id="trace-2" test="fn:trace('test', 'trace label') = 'test'">
				Should have signalled a trace with a label.
			</sch:assert>
			
			<!-- abs -->
			<sch:assert id="abs-1-pos" test="fn:abs(10.5) = 10.5">
				A positive value should remain unchanged by `fn:abs($v)`.
			</sch:assert>
			<sch:assert id="abs-1-neg" test="fn:abs(-10.5) = 10.5">
				A negative value should switch sign by `fn:abs($v)`.
			</sch:assert>
			
			<!-- ceiling -->
			<sch:assert id="ceiling-1-pos" test="fn:ceiling(10.5) = 11">
				A positive value should round up by `fn:ceiling($v)`.
			</sch:assert>
			<sch:assert id="ceiling-1-neg" test="fn:ceiling(-10.5) = -10">
				A negative value should round closer to 0 by `fn:ceiling($v)`.
			</sch:assert>
			
			<!-- floor -->
			<sch:assert id="floor-1-pos" test="fn:floor(10.5) = 10">
				A positive value should round down by `fn:floor($v)`.
			</sch:assert>
			<sch:assert id="floor-1-neg" test="fn:floor(-10.5) = -11">
				A negative value should round further from 0 by `fn:floor($v)`.
			</sch:assert>
			
			<!-- round -->
			<sch:assert id="round-1-pos-half" test="fn:round(2.5) = 3.0">
				A positive value at exactly a half should round up `fn:round($v)`.
			</sch:assert>
			<sch:assert id="round-1-pos-belowhalf" test="fn:round(2.4999) = 2.0">
				A positive value at exactly a half should round up `fn:round($v)`.
			</sch:assert>
			<sch:assert id="round-1-neg-half" test="fn:round(-2.5) = -2.0">
				A negative value at exactly a half should closer to 0 `fn:round($v)`.
			</sch:assert>
			<sch:assert id="round-2-pos" test="fn:round(1.125, 2) = 1.13">
				A positive second argument should round after the number of decimals `fn:round($v, 2)`.
			</sch:assert>
			<sch:assert id="round-2-neg" test="fn:round(8452, -2) = 8500">
				A negative two (-2) second argument should round to the nearest hundreds `fn:round($v, -2)`.
			</sch:assert>
			
			<!-- round-half-to-even -->
			<sch:assert id="round-half-to-even-1-pos-0-5" test="fn:round-half-to-even(0.5) = 0.0">
				A positive value at `0.5` should round to `0.0` `fn:round-half-to-even($v)`.
			</sch:assert>
			<sch:assert id="round-half-to-even-1-pos-1-5" test="fn:round-half-to-even(1.5) = 2.0">
				A positive value at `1.5` should round to `2.0` `fn:round-half-to-even($v)`.
			</sch:assert>
			<sch:assert id="round-half-to-even-1-pos-2-5" test="fn:round-half-to-even(2.5) = 2.0">
				A positive value at `2.5` should round to `2.0` `fn:round-half-to-even($v)`.
			</sch:assert>
			<sch:assert id="round-half-to-even-2-pos" test="fn:round-half-to-even(0.0047564, 2) = 0.0">
				A positive second argument should round after the number of decimals `fn:round-half-to-even($v, 2)`.
			</sch:assert>
			<sch:assert id="round-half-to-even-2-neg" test="fn:round-half-to-even(35612.25, -2) = 35600">
				A negative two (-2) second argument should round to the nearest hundreds `fn:round-half-to-even($v, -2)`.
			</sch:assert>
			
			<!-- number -->
			<sch:assert id="number-0-nan" test="fn:string(fn:number()) = 'NaN'">
				Number conversion `fn:string(fn:number()) = 'NaN'`.
			</sch:assert>
			<sch:assert id="number-1" test="fn:number(../@row-number) = 2.0">
				Number conversion `fn:number(../@row-number) = 2.0`.
			</sch:assert>
			


			<!-- concat -->
			<sch:assert id="concat-2" test="fn:concat('un', 'grateful') = 'ungrateful'">
				Concat `fn:concat('un', 'grateful') = 'ungrateful'`.
			</sch:assert>
			<!-- concat -->
			<sch:assert id="concat-10" test="fn:concat('Thy ', 'old ', &quot;groans&quot;, &quot;&quot;, ' ring', ' yet', ' in', ' my', ' ancient',' ears.') = 'Thy old groans ring yet in my ancient ears.'">
				Concat `fn:concat('Thy ', 'old ', &quot;groans&quot;, &quot;&quot;, ' ring', ' yet', ' in', ' my', ' ancient',' ears.') = 'Thy old groans ring yet in my ancient ears.'`.
			</sch:assert>
		</sch:rule>
	</sch:pattern>
</sch:schema>
