class Complete < ApplicationRecord
  belongs_to :completable, polymorphic: true
  belongs_to :user
end
