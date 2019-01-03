This is a test to make sure that `version-bump-prompt` correctly updates plain-text files.
It does a global find-and-replace, so all occurrances of the old version number should be replaced with the new version, but any other version numbers should remain unchanged.

If all goes well, version 1.2.3 and v1.2.3 should both get updated, but version 5.6.7 and v8.9.10 should not be changed.
