import Candidate from './candidate.entity';
import Techs, { KnowledgeLevel } from '../value-object/techs-value-object';

describe('Domain > Candidate', () => {
  test('Should create a candidate', () => {
    const candidate = new Candidate({
      email: 'foo@bar.com',
      name: 'foo',
      image: 'https://www.github.com/Vicenteefenequis',
      github: 'https://www.github.com/Vicenteefenequis',
      phone: 'any_phone',
      techs: [
        new Techs({
          knowledge_level: KnowledgeLevel.ADVANCED,
          tech: 'any_tech',
        }),
      ],
    });

    expect(candidate.id).toBeDefined();
    expect(candidate.name).toBe('foo');
    expect(candidate.image).toBe('https://www.github.com/Vicenteefenequis');
    expect(candidate.email).toBe('foo@bar.com');
    expect(candidate.github).toBe('https://www.github.com/Vicenteefenequis');
    expect(candidate.phone).toBe('any_phone');
    expect(candidate.techs.length).toBe(1);
    expect(candidate.techs[0].knowledge_level).toBe(KnowledgeLevel.ADVANCED);
    expect(candidate.techs[0].tech).toBe('any_tech');
  });

  it('Should Canidate throws error', () => {
    expect(() => {
      new Candidate({
        email: '',
        name: '',
        image: '',
        github: '',
        phone: '',
        techs: [],
      });
    }).toThrowError(
      'Canidate: name must be at least 2 characters,Canidate: name is a required field,Canidate: email is a required field,Canidate: image is a required field,Canidate: phone is a required field,Canidate: github is a required field',
    );
  });
});
