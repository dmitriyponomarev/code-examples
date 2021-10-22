import DataLoader from 'dataloader';
import { gql } from 'apollo-server-express';
import { print } from 'graphql';
import config from 'config';
import { GraphQLClient } from 'graphql-request';
import { LoaderKey } from './delegation/delegationHelper';
import { SelectionNode } from 'graphql/language/ast';

const personService = new GraphQLClient(
  `${config.get('services.person')}/graphql`,
  {
    headers: {
      'User-Agent': 'dbx-trips-service',
    },
  }
);

export interface JumperMetadata {
  personId: number;
  email?: string;
  phoneNumber?: string;
}

export interface JumperUserData {
  user?: {
    person: JumperMetadata;
  };
}

const hasSelectedField = (
  fieldName: string,
  selections?: ReadonlyArray<SelectionNode>
): boolean =>
  selections?.some((s) => {
    if ('name' in s) {
      return s.name.value === fieldName;
    }
    return false;
  }) ?? false;

const buildQuery = (selections?: ReadonlyArray<SelectionNode>) =>
  print(gql`query JumperMetadataByUserId($userId: ID!) {
    user(userId: $userId) {
      userId
      person {
        personId
        ${hasSelectedField('emails', selections) ? 'email' : ''}
        ${hasSelectedField('phoneNumbers', selections) ? 'phoneNumber' : ''}
      }
    }
  }`);

const getJumperMetadataByUserId = async (
  userId: number,
  query: string
): Promise<JumperMetadata | undefined> => {
  const { user } = await personService.request<JumperUserData>(query, {
    userId,
  });
  return user?.person;
};

export const jumperMetadataLoader = () =>
  new DataLoader<LoaderKey, JumperMetadata | undefined>(
    (keys: readonly LoaderKey[]) => {
      const {
        info: { fieldNodes },
      } = keys[0];
      const selections = fieldNodes[0]?.selectionSet?.selections;
      const query = buildQuery(selections);
      return Promise.all(
        keys.map(({ userId }) => getJumperMetadataByUserId(userId, query))
      );
    },
    { cache: true }
  );
