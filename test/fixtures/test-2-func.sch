<?xml version="1.0" encoding="UTF-8"?>
<sch:schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:sch="http://purl.oclc.org/dsdl/schematron">
	<sch:ns prefix="dh" uri="urn:dh" />
	<sch:ns prefix="xhtml" uri="http://www.w3.org/1999/xhtml" />

	<function xmlns="http://www.w3.org/1999/XSL/Transform" name="dh:index-string" as="xs:string">
        <param name="pref" as="xs:string"/>
        <param name="node"/>
        <variable name="idx" select="count($node/preceding-sibling::*) + 1"/>
        <value-of select="concat($pref, xs:string($idx))"/>
    </function>

	<sch:pattern xmlns:sch="http://purl.oclc.org/dsdl/schematron" id="patt-test-2-func">
		<sch:rule context="xhtml:td">
			<sch:assert test="dh:index-string(concat(dh:index-string('Cell.', ..), '.'), .) = xs:string(.)">
				The element <name/> has valid content.
			</sch:assert>
		</sch:rule>
		<sch:rule context="xhtml:th" role="warning">
			<sch:assert test="dh:index-string(concat(dh:index-string('Cell.', ..), '.'), .) = xs:string(.)">
				The element <name/> has valid content.
			</sch:assert>
		</sch:rule>
	</sch:pattern>
</sch:schema>