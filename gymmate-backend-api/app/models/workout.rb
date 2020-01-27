class Workout < ApplicationRecord
  belongs_to :program
  belongs_to :user
  has_one :complete, as: :completable
end
